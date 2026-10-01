<script setup lang="ts">
import type { PackageInfo, RuleInfo } from '@eslint-stylistic/metadata'

defineProps<{
  rule: RuleInfo
  package: PackageInfo
}>()

function formatLanguage(language: string) {
  switch (language) {
    case '*':
      return 'Any'
    case 'js/*':
      return 'JS / TS'
    case 'json/*':
    case 'jsonc/*':
      return 'JSON'
    default:
      return language
  }
}
</script>

<template>
  <tr>
    <td>
      <a :href="`/rules/${rule.name}`" class="decoration-none!">
        <code ws-nowrap>
          {{ rule.name }}
        </code>
      </a>
    </td>
    <td>{{ rule.meta?.docs?.description }}</td>
    <td>
      <code
        v-for="language of rule.meta?.languages"
        :key="language"
        ws-nowrap mr1
      >{{ formatLanguage(language) }}</code>
    </td>
    <td :title="rule.meta?.docs?.recommended ? 'This rule is included in the shared configuration' : ''">
      {{ rule.meta?.docs?.recommended ? '💼' : '' }}
    </td>
    <td :title="rule.meta?.fixable ? 'This rule has an auto-fix' : ''">
      {{ rule.meta?.fixable ? '🔧' : '' }}
    </td>
    <td :title="rule.meta?.docs?.experimental ? 'This rule is experimental' : ''">
      {{ rule.meta?.docs?.experimental ? '🧪' : '' }}
    </td>
  </tr>
</template>
