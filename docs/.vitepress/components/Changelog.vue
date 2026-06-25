<script setup lang="ts">
import type { CommitInfo } from '../plugins/changelog'
import changelogData from 'virtual:changelog'
import { computed } from 'vue'

const props = defineProps<{
  ruleName: string
}>()

const REPO_URL = 'https://github.com/eslint-stylistic/eslint-stylistic'

function badgeClass(commit: CommitInfo): string {
  if (commit.breaking) {
    return commit.type === 'feat'
      ? 'bg-yellow:12 text-yellow-700 dark:text-yellow border-yellow:25'
      : 'bg-red:12 text-red-700 dark:text-red border-red:25'
  }

  return commit.type === 'feat'
    ? 'bg-teal:12 text-teal-700 dark:text-teal border-teal:25'
    : 'bg-blue:12 text-blue-700 dark:text-blue border-blue:25'
}

const entries = computed(() => changelogData[props.ruleName] ?? [])
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
                :href="`${REPO_URL}/${part.href}`"
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
