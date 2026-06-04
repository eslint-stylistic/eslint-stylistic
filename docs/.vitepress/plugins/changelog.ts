import type { Plugin } from 'vite'
import { CommitParser } from 'conventional-commits-parser'
import Git from 'simple-git'

export interface CommitPart {
  kind: 'text' | 'code' | 'link'
  content: string
  href?: string
}

export interface CommitInfo {
  hash: string
  date: string
  type: 'feat' | 'fix'
  breaking: boolean
  parts: CommitPart[]
}

export interface VersionGroup {
  version: string
  versionDate: string
  commits: CommitInfo[]
}

export const REPO_URL = 'https://github.com/eslint-stylistic/eslint-stylistic'

const ID = 'virtual:changelog'

const PARSER = new CommitParser({
  headerPattern: /^(\w+)(?:\(([\w-]+)\))?(!)?: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'breaking', 'subject'],
})

const PART_PATTERN = /(`[^`]+`|#\d+)|([^`#]+)/g

function tokenizeSubject(subject: string): CommitPart[] {
  const parts: CommitPart[] = []
  let token: RegExpExecArray | null
  PART_PATTERN.lastIndex = 0
  while ((token = PART_PATTERN.exec(subject)) !== null) {
    if (token[1]?.startsWith('`')) {
      parts.push({ kind: 'code', content: token[1].slice(1, -1) })
    }
    else if (token[1]?.startsWith('#')) {
      const issue = token[1].slice(1)
      parts.push({
        kind: 'link',
        content: token[1],
        href: `${REPO_URL}/issues/${issue}`,
      })
    }
    else {
      parts.push({ kind: 'text', content: token[2] })
    }
  }
  return parts
}

async function getChangelog(from: string) {
  try {
    const git = Git({ maxConcurrentProcesses: 200 })

    const result: Record<string, VersionGroup[]> = {}
    let currentVersion: { version: string, date: string } | null = null

    const rawLogs = (await git.log({ from })).all

    for (const raw of rawLogs) {
      if (raw.message.includes('chore: release')) {
        const match = raw.message.match(/chore: release\s+(\S+)/)
        if (match)
          currentVersion = { version: match[1], date: raw.date }
        continue
      }

      const parsed = PARSER.parse(raw.message)
      if (!parsed.type || (parsed.type !== 'feat' && parsed.type !== 'fix'))
        continue
      if (!parsed.scope)
        continue
      if (!currentVersion)
        continue

      const rule = parsed.scope
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
        type: parsed.type,
        breaking: Boolean(parsed.breaking),
        parts: tokenizeSubject(parsed.subject ?? ''),
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
