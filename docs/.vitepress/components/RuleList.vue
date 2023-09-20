<script setup lang="ts">
import { packages } from '@eslint-stylistic/metadata'

const props = defineProps<{
  package: string
}>()

const pkg = packages.find(p => p.shortId === props.package)!
</script>

<template>
  <table>
    <RuleItem
      v-for="rule of pkg.rules"
      :key="rule.name"
      :rule="rule"
      :package="pkg"
    />
  </table>
</template>
