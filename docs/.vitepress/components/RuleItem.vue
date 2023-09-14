<script setup lang="ts">
import type { PackageInfo, RuleInfo } from '../../../packages/metadata'

defineProps<{
  rule: RuleInfo
  package: PackageInfo
}>()
</script>

<template>
  <tr>
    <td>
      <a :href="`/rules/${package.shortId}/${rule.name}`">
        <code>
          {{ rule.name }}
        </code>
      </a>
    </td>
    <td>{{ rule.meta?.docs?.description }}</td>
  </tr>
</template>
