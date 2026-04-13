import type { ExpectStatic } from 'vitest'
import fs, { promises as fsp } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createPatch } from 'diff'
import fg from 'fast-glob'

export const fixturesDir = fileURLToPath(new URL('fixtures', import.meta.url))

export interface RunFixtureTestOptions {
  from: string
  output: string
  target: string
  configWriter: (target: string) => Promise<void>
  lintRunner: (target: string) => Promise<void>
  ignoreFiles: string[]
  copyFilter?: (src: string) => boolean
  errorOutput?: string
}

const normalizeContent = (text: string) => text.replace(/\r\n/g, '\n')

export async function runFixtureTest(
  expect: ExpectStatic,
  options: RunFixtureTestOptions,
): Promise<void> {
  const { from, output, target, configWriter, lintRunner, ignoreFiles, copyFilter, errorOutput } = options

  await fsp.cp(from, target, {
    recursive: true,
    filter: (src) => {
      if (src.includes('node_modules'))
        return false
      return copyFilter ? copyFilter(src) : true
    },
  })

  await configWriter(target)

  let error: unknown = null
  try {
    await lintRunner(target)
  }
  catch (e) {
    error = e
  }

  const files = await fg('**/*', {
    ignore: ['node_modules', ...ignoreFiles],
    cwd: target,
  })

  await Promise.all(files.map(async (file) => {
    const content = normalizeContent(await fsp.readFile(join(target, file), 'utf-8'))
    const source = normalizeContent(await fsp.readFile(join(from, file), 'utf-8'))
    const targetPath = join(output, file)

    if (content === source) {
      if (fs.existsSync(targetPath))
        await fsp.unlink(targetPath)
    }
    else {
      try {
        await expect.soft(content)
          .toMatchFileSnapshot(targetPath)
        if (errorOutput) {
          const errorPath = join(errorOutput, `${file}.patch`)
          if (fs.existsSync(errorPath))
            fs.unlinkSync(errorPath)
        }
      }
      catch (err) {
        if (errorOutput) {
          const errorPath = join(errorOutput, `${file}.patch`)
          const expected = normalizeContent(fs.readFileSync(targetPath, 'utf-8'))
          const patch = createPatch(file, expected, content)
          return await expect.soft(patch).toMatchFileSnapshot(errorPath)
        }
        throw err
      }
    }
  }))

  if (!errorOutput && error)
    throw error
}
