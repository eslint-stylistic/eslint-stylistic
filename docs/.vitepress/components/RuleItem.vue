<script setup lang="ts">
import type { PackageInfo, RuleInfo } from '@eslint-stylistic/metadata'
import { computed } from 'vue'

const props = defineProps<{
  rule: RuleInfo
  package: PackageInfo
}>()

const shortId = computed(() => {
  if (props.package.shortId === 'default')
    return props.rule.docsEntry.includes('eslint-plugin-js') ? 'js' : 'ts'
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
