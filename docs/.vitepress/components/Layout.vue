<script setup lang="ts">
import { inBrowser, useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'
import { RULE_ALIAS } from '../../../rule-alias'

const { page } = useData()
const { go } = useRouter()

watch(
  () => page.value,
  ({ isNotFound }) => {
    if (!isNotFound || !inBrowser)
      return

    // Handle rule redirections
    const parts = window.location.pathname.split('/')
    const ruleName = (parts[1] === 'rules' && parts.length === 4) ? parts[3] : null
    if (ruleName && RULE_ALIAS[ruleName])
      go([...parts.slice(0, 3), RULE_ALIAS[ruleName]].join('/'))
  },
  { immediate: true },
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
