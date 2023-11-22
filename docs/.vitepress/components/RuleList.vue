<script setup lang="ts">
import { packages } from '@eslint-stylistic/metadata'

const props = defineProps<{
  package: string
}>()

const pkg = packages.find(p => p.shortId === props.package)!
</script>

<template>
  <p>Each rule has emojis denoting:</p>
  <div flex="~ items-center gap-2" border="~ solid gray/10 rounded" p3>
    <code w-1.9em h-1.9em>🔧</code>
    <div flex="~ items-center gap-2 wrap">
      Some problems reported are fixable by the <code>--fix</code> command line option
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <td>Rule</td>
        <td>Description</td>
        <td></td>
      </tr>
    </thead>

    <tbody>
      <RuleItem
        v-for="rule of pkg.rules"
        :key="rule.name"
        :rule="rule"
        :package="pkg"
      />
    </tbody>
  </table>
</template>
