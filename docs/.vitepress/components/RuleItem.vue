<script setup lang="ts">
import type { PackageInfo, RuleInfo } from '@eslint-stylistic/metadata'
import { computed } from 'vue'

const props = defineProps<{
  rule: RuleInfo
  package: PackageInfo
}>()

const shortId = computed(() => props.package.shortId)
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
    <td :title="rule.meta?.fixable ? 'This rule has an auto-fix' : ''">
      {{ rule.meta?.fixable && '🔧' }}
    </td>
  </tr>
</template>
