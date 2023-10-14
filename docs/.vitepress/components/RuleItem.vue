<script setup lang="ts">
import type { PackageInfo, RuleInfo } from '@eslint-stylistic/metadata'
import { computed } from 'vue'

const props = defineProps<{
  rule: RuleInfo
  package: PackageInfo
}>()

const shortId = computed(() => {
  if (props.package.shortId === 'default') {
    const docsEntry = props.rule.docsEntry
    return docsEntry.includes('eslint-plugin-ts') ? 'ts' : docsEntry.includes('eslint-plugin-jsx') ? 'jsx' : 'js'
  }
  return props.package.shortId
})
</script>

<template>
  <tr>
    <td>
      <a :href="`/rules/${shortId}/${rule.name}`">
        <code>
          {{ rule.name }}
        </code>
      </a>
    </td>
    <td>{{ rule.meta?.docs?.description }}</td>
  </tr>
</template>
