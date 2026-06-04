import type { Plugin } from 'vite'
import Git from 'simple-git'

interface CommitInfo {
  hash: string
  date: string
  message: string
}

export interface VersionGroup {
  version: string
  versionDate: string
  commits: CommitInfo[]
}

const ID = 'virtual:changelog'

async function getChangelog(from: string) {
  try {
    const git = Git({ maxConcurrentProcesses: 200 })

    const result: Record<string, VersionGroup[]> = {}
    let currentVersion: { version: string, date: string } | null = null

    const rawLogs = (await git.log({ from })).all

    for (const raw of rawLogs) {
      if (!raw.message.includes('chore: release')
        && !raw.message.includes('!')
        && !raw.message.startsWith('feat')
        && !raw.message.startsWith('fix')) {
        continue
      }

      if (raw.message.includes('chore: release')) {
        const match = raw.message.match(/chore: release\s+(\S+)/)
        if (match)
          currentVersion = { version: match[1], date: raw.date }
        continue
      }

      const match = raw.message.match(/^\w+(?:\(([\w-]+)\))?!?:\s*/)
      if (!match || !match[1])
        continue

      if (!currentVersion)
        continue

      const rule = match[1]
      const groups = result[rule] || (result[rule] = [])

      if (!groups.length || groups[groups.length - 1].version !== currentVersion.version) {
        groups.push({
          version: currentVersion.version,
          versionDate: currentVersion.date,
          commits: [],
        })
      }

      groups[groups.length - 1].commits.push({
        hash: raw.hash,
        date: raw.date,
        message: raw.message,
      })
    }

    return result
  }
  catch (error) {
    console.error('Failed to generate changelog:', error)
    throw error
  }
}

// eslint-disable-next-line antfu/no-top-level-await
export const changelogData = await getChangelog('v5.0.0')

export function Changelog(): Plugin {
  return {
    name: 'eslint-stylistic-changelog',
    resolveId(id) {
      return id === ID ? ID : null
    },
    load(id) {
      if (id !== ID)
        return null
      return `export default ${JSON.stringify(changelogData)}`
    },
  }
}
