<script setup lang="ts">
import { packages } from '../../../packages/metadata'
</script>

<template>
  <div>
    <div v-for="pkg of packages" :key="pkg.name">
      <template v-if="pkg.rules.length">
        <h3><code>{{ pkg.name }}</code></h3>
        <table>
          <RuleItem
            v-for="rule of pkg.rules"
            :key="rule.name"
            :rule="rule"
            :package="pkg"
          />
        </table>
      </template>
    </div>
  </div>
</template>
