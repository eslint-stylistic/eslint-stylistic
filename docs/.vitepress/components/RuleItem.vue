<script setup lang="ts">
import { computed } from 'vue'
import type { PackageInfo, RuleInfo } from '@eslint-stylistic/metadata'

const props = defineProps<{
  rule: RuleInfo
  package: PackageInfo
}>()

const shortId = computed(() => props.package.shortId)
</script>

<template>
  <tr>
    <td>
      <a :href="`/rules/${shortId}/${rule.name}`" class="decoration-none!">
        <code ws-nowrap>
          {{ rule.name }}
        </code>
      </a>
    </td>
    <td>{{ rule.meta?.docs?.description }}</td>
    <td :title="rule.meta?.docs?.recommended ? 'This rule is included in the shared configuration' : ''">
      {{ rule.meta?.docs?.recommended ? '💼' : '' }}
    </td>
    <td :title="rule.meta?.fixable ? 'This rule has an auto-fix' : ''">
      {{ rule.meta?.fixable ? '🔧' : '' }}
    </td>
  </tr>
</template>
