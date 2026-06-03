import type { Plugin } from 'vite'
import Git from 'simple-git'

export interface CommitInfo {
  rules?: string[]
  version?: string
  hash: string
  date: string
  message: string
  authorName: string
  authorEmail: string
}

const ID = 'virtual:changelog'

async function getChangelog(from: string) {
  try {
    const git = Git({
      maxConcurrentProcesses: 200,
    })

    const rawLogs = (await git.log({ from })).all.filter((i) => {
      return i.message.includes('chore: release')
        || i.message.includes('!')
        || i.message.startsWith('feat')
        || i.message.startsWith('fix')
    })

    const logs: CommitInfo[] = rawLogs.map(i => ({
      hash: i.hash,
      date: i.date,
      message: i.message,
      authorName: i.author_name,
      authorEmail: i.author_email,
    }))

    for (const log of logs) {
      if (log.message.includes('chore: release')) {
        const match = log.message.match(/chore: release\s+(\S+)/)
        if (match)
          log.version = match[1]
        continue
      }
      const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
      const files = raw.replace(/\\/g, '/').trim().split('\n')
      log.rules = [
        ...new Set(
          files
            .map(i => i.match(/^packages\/eslint-plugin\/rules\/([^/]+)\//)?.[1])
            .filter((i): i is string => Boolean(i)),
        ),
      ]
    }

    return logs.filter(i => i.rules?.length || i.version)
  }
  catch (error) {
    console.error('Failed to generate changelog:', error)
    throw error
  }
}

// eslint-disable-next-line antfu/no-top-level-await
const data = await getChangelog('v5.0.0')

export function Changelog(): Plugin {
  return {
    name: 'eslint-stylistic-changelog',
    resolveId(id) {
      return id === ID ? ID : null
    },
    load(id) {
      if (id !== ID)
        return null
      return `export default ${JSON.stringify(data)}`
    },
  }
}
