<script setup lang="ts">
import { packages } from '@eslint-stylistic/metadata'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  package: string
}>()

const pkg = packages.find(p => p.shortId === props.package)!

const filter = ref()

const filterList = [
  {
    id: '',
    name: 'All',
    filters: [],
  },
  {
    id: 'spacing',
    name: 'Spacing',
    filters: [
      /^spaced?-/,
      /-spacing$/,
      /-spaces?$/,
    ],
  },
  {
    id: 'line-breaks',
    name: 'Line breaks',
    filters: [
      /\bnewlines?\b/,
      /\blinebreak\b/,
      /\bmultilines?\b/,
      /-new-line$/,
      /^padding-line-/,
      /^eol-last$/,
      /^lines-/,
    ],
  },
  {
    id: 'brackets',
    name: 'Brackets',
    filters: [
      /\bcurly\b/,
      /\bbrace\b/,
      /\bbracket\b/,
      /\bparens?\b/,
      /^wrap-/,
    ],
  },
  {
    id: 'indent',
    name: 'Indentation',
    filters: [
      /\bindent\b/,
    ],
  },
  {
    id: 'quotes',
    name: 'Quotes',
    filters: [
      /\bquotes?\b/,
    ],
  },
  {
    id: 'commas',
    name: 'Commas',
    filters: [
      /\bcommas?\b/,
    ],
  },
  {
    id: 'semis',
    name: 'Semicolons',
    filters: [
      /\bsemis?\b/,
    ],
  },
  {
    id: 'disallow',
    name: 'Disallow',
    filters: [
      /^no-/,
    ],
  },
  {
    id: 'misc',
    name: 'Misc.',
    filters: [],
  },
]

onMounted(() => {
  const search = new URLSearchParams(window.location.search)
  if (search.get('filter'))
    filter.value = String(search.get('filter') ?? '')

  watch(filter, () => {
    if (!filter.value)
      search.delete('filter')
    else
      search.set('filter', filter.value)
    window.history.replaceState(null, '', `?${search.toString()}`)
  })
})

// TODO: add fuze search

const filtered = computed(() => {
  if (!filter.value)
    return pkg.rules
  if (filter.value === 'misc')
    return pkg.rules.filter(i => !filterList.some(f => f.filters.some(r => r.test(i.name))))
  const list = filterList.find(f => f.id === filter.value)
  if (!list)
    return pkg.rules
  return pkg.rules.filter(i => list.filters.some(r => r.test(i.name)))
})

function clearFilter() {
  filter.value = ''
  document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div flex="~ col gap-2" border="~ solid gray/10 rounded" p3>
    <div op75 text-sm border="b b-solid gray/10" pb2 mb1>
      Each rule has emojis denoting:
    </div>
    <div flex="~ items-center gap-2">
      <code w-1.9em h-1.9em>🔧</code>
      <div flex="~ items-center gap-2 wrap" text-sm>
        Some problems reported are fixable by the <code>--fix</code> command line option
      </div>
    </div>
  </div>

  <div
    flex="~ items-center gap-4"
    border="x t solid gray/10 rounded-t"
    class="bg-$vp-c-bg-soft"
    px4 py2 mt6 mb--1px
  >
    <div i-carbon-filter title="Filters" text-xl flex-none />
    <div flex="~ items-center gap-2 wrap">
      <label
        v-for="i of filterList"
        :key="i.id" :for="`filter-${i.id}`"
        select-none
        border="~ solid gray/10 rounded"
        px2 py0.5 text-sm
        :class="filter === i.id ? 'text-$vp-c-brand bg-$vp-c-brand-soft' : 'op50'"
      >
        <input :id="`filter-${i.id}`" v-model="filter" type="radio" :value="i.id" hidden>
        {{ i.name }}
      </label>
    </div>
  </div>

  <table important-my-0 important-w-full table>
    <thead>
      <tr>
        <td>Rule</td>
        <td>Description</td>
        <td />
      </tr>
    </thead>

    <tbody>
      <RuleItem
        v-for="rule of filtered"
        :key="rule.name"
        :rule="rule"
        :package="pkg"
      />
    </tbody>
  </table>

  <div
    flex="~ gap-2 items-center"
    border="x b solid gray/10 rounded-b"
    px4 py2 mt--1px
  >
    <template v-if="filter">
      <div text-sm op50>
        Showing {{ filtered.length }} of {{ pkg.rules.length }} rules.
      </div>
      <button button-action @click="clearFilter()">
        <div i-carbon-filter-remove text-lg />
        <span>Reset filter</span>
      </button>
    </template>
    <template v-else>
      <div text-sm op50>
        {{ pkg.rules.length }} rules in total.
      </div>
    </template>
  </div>
</template>
