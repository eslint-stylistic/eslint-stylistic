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

let cache: CommitInfo[] | undefined

export async function getChangeLog(count = 200) {
  if (cache)
    return cache

  try {
    const git = Git({
      maxConcurrentProcesses: 200,
    })

    const rawLogs = (await git.log({ maxCount: count })).all.filter((i) => {
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
        const match = log.message.match(/chore: release\s+(.+)/)
        if (match)
          log.version = match[1].trim()
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

    const result = logs.filter(i => i.rules?.length || i.version)
    cache = result
    return result
  }
  catch (error) {
    console.error('Failed to generate changelog:', error)
    throw error
  }
}
