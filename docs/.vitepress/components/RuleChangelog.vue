<script setup lang="ts">
import type { CommitInfo } from '../../../scripts/changelog'
import changeLogData from 'virtual:changelog'
import { computed } from 'vue'

const props = defineProps<{
  ruleName: string
}>()

const entries = computed(() => {
  const list = changeLogData
    .filter(i => i.rules?.includes(props.ruleName) || i.version)

  const grouped: { version?: string, commits: CommitInfo[] }[] = []
  let current: typeof grouped[0] | null = null

  for (const item of list) {
    if (item.version) {
      current = { version: item.version, commits: [] }
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
    <h2>Changelog</h2>
    <div v-for="group of entries" :key="group.version" mb-4>
      <h3 text-lg mb-2>
        v{{ group.version }}
      </h3>
      <ul>
        <li v-for="commit of group.commits" :key="commit.hash" mb-1>
          <a
            :href="`https://github.com/eslint-stylistic/eslint-stylistic/commit/${commit.hash}`"
            target="_blank"
            op50 text-sm mr-2 font-mono
          >
            {{ commit.hash.slice(0, 7) }}
          </a>
          <span>{{ commit.message }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
