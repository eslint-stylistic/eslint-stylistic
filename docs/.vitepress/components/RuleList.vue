<script setup lang="ts">
import { packages } from '@eslint-stylistic/metadata'

const props = defineProps<{
  package: string
}>()

const pkg = packages.find(p => p.shortId === props.package)!
</script>

<template>
  <table>
    <thead>
      <tr>
        <td>
          Rule
        </td>

        <td>
          Description
        </td>

        <td>
          Fixable?
        </td>
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
