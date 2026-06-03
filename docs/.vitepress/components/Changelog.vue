<script setup lang="ts">
import type { CommitInfo } from '../plugins/changelog'
import changelogData from 'virtual:changelog'
import { computed } from 'vue'

const props = defineProps<{
  ruleName: string
}>()

function renderCommitMessage(msg: string) {
  return msg
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/#(\d+)/g, '<a href=\'https://github.com/eslint-stylistic/eslint-stylistic/issues/$1\' target=\'_blank\'>#$1</a>')
}

const entries = computed(() => {
  const list = changelogData
    .filter(i => i.rules?.includes(props.ruleName) || i.version)

  const grouped: { version?: string, versionDate?: string, commits: CommitInfo[] }[] = []
  let current: typeof grouped[0] | null = null

  for (const item of list) {
    if (item.version) {
      current = { version: item.version, versionDate: item.date, commits: [] }
      grouped.push(current)
    }
    else if (current) {
      current.commits.push(item)
    }
  }

  return grouped.filter(g => g.commits.length > 0)
})
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
          <a
            :href="`https://github.com/eslint-stylistic/eslint-stylistic/commit/${commit.hash}`"
            target="_blank"
            op80 mr-2 font-mono
          >
            {{ commit.hash.slice(0, 7) }}
          </a>
          <span v-html="renderCommitMessage(commit.message.replace(`(${props.ruleName})`, ''))" />
        </li>
      </ul>
    </div>
  </div>
</template>
