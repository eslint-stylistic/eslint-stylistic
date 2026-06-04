<script setup lang="ts">
import type { CommitInfo } from '../plugins/changelog'
import changelogData from 'virtual:changelog'
import { computed } from 'vue'

interface CommitPart {
  kind: 'text' | 'code' | 'link'
  content: string
  href?: string
}

interface RenderCommit {
  hash: string
  type: CommitInfo['type']
  breaking: boolean
  parts: CommitPart[]
}

const props = defineProps<{
  ruleName: string
}>()

const PART_PATTERN = /(`[^`]+`|#\d+)|([^`#]+)/g
const REPO_URL = 'https://github.com/eslint-stylistic/eslint-stylistic'

function tokenizeSubject(subject: string): CommitPart[] {
  const parts: CommitPart[] = []
  let token: RegExpExecArray | null
  PART_PATTERN.lastIndex = 0
  while ((token = PART_PATTERN.exec(subject)) !== null) {
    if (token[1]) {
      if (token[1].startsWith('`')) {
        parts.push({ kind: 'code', content: token[1].slice(1, -1) })
      }
      else {
        const issue = token[1].slice(1)
        parts.push({
          kind: 'link',
          content: token[1],
          href: `${REPO_URL}/issues/${issue}`,
        })
      }
    }
    else {
      parts.push({ kind: 'text', content: token[2] })
    }
  }
  return parts
}

function badgeClass(commit: RenderCommit): string {
  if (commit.breaking) {
    return commit.type === 'feat'
      ? 'bg-yellow:12 text-yellow-700 dark:text-yellow border-yellow:25'
      : 'bg-red:12 text-red-700 dark:text-red border-red:25'
  }

  return commit.type === 'feat'
    ? 'bg-teal:12 text-teal-700 dark:text-teal border-teal:25'
    : 'bg-blue:12 text-blue-700 dark:text-blue border-blue:25'
}

const entries = computed(() => (changelogData[props.ruleName] ?? []).map(group => ({
  ...group,
  commits: group.commits.map((commit): RenderCommit => ({
    hash: commit.hash,
    type: commit.type,
    breaking: commit.breaking,
    parts: tokenizeSubject(commit.subject),
  })),
})))
</script>

<template>
  <div v-if="entries.length" mt-8>
    <div v-for="group of entries" :key="group.version" mb-4>
      <h4 text-lg mb-2>
        <code font-bold>{{ group.version }}</code>
        <span v-if="group.versionDate" op-50 text-xs>
          on <time :datetime="group.versionDate">{{ new Date(group.versionDate).toLocaleDateString() }}</time>
        </span>
      </h4>
      <ul>
        <li v-for="commit of group.commits" :key="commit.hash" mb-1 text-sm>
          <span
            class="inline-block align-middle px-1.5 py-0.5 mr-1.5 rounded text-xs font-mono border"
            :class="badgeClass(commit)"
          >
            {{ commit.type }}{{ commit.breaking ? '!' : '' }}
          </span>
          <a
            :href="`${REPO_URL}/commit/${commit.hash}`"
            target="_blank"
            op80 mr-2 font-mono
          >
            {{ commit.hash.slice(0, 7) }}
          </a>
          <span>
            <template v-for="(part, i) in commit.parts" :key="i">
              <code v-if="part.kind === 'code'">{{ part.content }}</code>
              <a
                v-else-if="part.kind === 'link'"
                :href="part.href"
                target="_blank"
              >{{ part.content }}</a>
              <template v-else>{{ part.content }}</template>
            </template>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
