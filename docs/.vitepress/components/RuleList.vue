<script setup lang="ts">
import { packages } from '@eslint-stylistic/metadata'
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import Fuse from 'fuse.js'

const props = defineProps<{
  package: string
}>()

const pkg = markRaw(packages.find(p => p.shortId === props.package)!)

function match(regexes: RegExp[]) {
  return pkg.rules.filter(i => regexes.some(r => r.test(i.name)))
}

const filter = ref()
const search = ref('')

const filterList = [
  {
    id: '',
    name: 'All',
    rules: pkg.rules,
  },
  {
    id: 'spacing',
    name: 'Spacing',
    rules: match([
      /\bspacing\b/,
      /\bspace[sd]?\b/,
      /\bwhitespaces?\b/,
    ]),
  },
  {
    id: 'line-breaks',
    name: 'Line breaks',
    rules: match([
      /\bnewlines?\b/,
      /\blinebreak\b/,
      /\bmultilines?\b/,
      /-new-line$/,
      /^padding-line-/,
      /^eol-last$/,
      /^lines-/,
    ]),
  },
  {
    id: 'brackets',
    name: 'Brackets',
    rules: match([
      /\bcurly\b/,
      /\bbrace\b/,
      /\bbracket\b/,
      /\bparens?\b/,
      /\bwrap\b/,
    ]),
  },
  {
    id: 'indent',
    name: 'Indent',
    rules: match([
      /\bindent\b/,
    ]),
  },
  {
    id: 'quotes',
    name: 'Quotes',
    rules: match([
      /\bquotes?\b/,
    ]),
  },
  {
    id: 'commas',
    name: 'Commas',
    rules: match([
      /\bcommas?\b/,
    ]),
  },
  {
    id: 'semis',
    name: 'Semis',
    rules: match([
      /\bsemis?\b/,
    ]),
  },
  {
    id: 'operators',
    name: 'Operators',
    rules: match([
      /-ops?$/,
      /\boperators?\b/,
      /\bternary\b/,
      /^dot-location$/,
    ]),
  },
  {
    id: 'comments',
    name: 'Comments',
    rules: match([
      /\bcomments?\b/,
    ]),
  },
  {
    id: 'jsx',
    name: 'JSX',
    rules: match([
      /\bjsx\b/,
    ]),
  },
  {
    id: 'type',
    name: 'Types',
    rules: match([
      /\btype\b/,
    ]),
  },
  {
    id: 'disallow',
    name: 'Disallow',
    rules: match([
      /^no-/,
    ]),
  },
  {
    id: 'misc',
    name: 'Misc.',
    rules: [],
  },
]

const categorizedRules = new Set(filterList.slice(1).flatMap(i => i.rules))
filterList.find(i => i.id === 'misc')!.rules = pkg.rules.filter(i => !categorizedRules.has(i))

onMounted(() => {
  const search = new URLSearchParams(window.location.search)
  filter.value = String(search.get('filter') || '')

  watch(filter, () => {
    if (!filter.value)
      search.delete('filter')
    else
      search.set('filter', filter.value)
    window.history.replaceState(null, '', `?${search.toString()}`)
  })
})

const filterResult = computed(() => {
  if (!filter.value)
    return pkg.rules
  const list = filterList.find(f => f.id === filter.value)
  if (!list)
    return pkg.rules
  return list.rules
})

const fuse = computed(() => new Fuse(filterResult.value, {
  keys: ['name', 'meta.docs.description'],
  threshold: 0.3,
}))

const searchResult = computed(() => {
  if (!search.value)
    return filterResult.value
  return fuse.value.search(search.value).map(i => i.item)
})

function clearFilter() {
  filter.value = ''
  search.value = ''
  document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div flex="~ col gap-2" border="~ solid base rounded" p3>
    <div op75 text-sm border="b b-solid base" pb2 mb1>
      Each rule has emojis denoting:
    </div>
    <div flex="~ items-center gap-2">
      <code w-1.9em h-1.9em>💼</code>
      <div flex="~ items-center gap-2 wrap" text-sm>
        The rule is part of the shared configuration
      </div>
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
    border="~ solid base rounded"
    px4 py2 mt6 mb--1px
  >
    <div i-carbon-search title="Search" text-xl flex-none />
    <input
      v-model="search"
      placeholder="Search rules"
      class="w-full"
      border="~ solid base rounded"
      px3 py1.5 text-sm
    >
  </div>

  <div
    flex="~ items-center gap-4"
    border="x t x-solid t-solid base rounded-t"
    px4 py2 mt4
  >
    <div i-carbon-filter title="Filters" text-xl flex-none />
    <div flex="~ items-center gap-2 wrap">
      <template
        v-for="i of filterList"
        :key="i.id"
      >
        <label
          v-if="i.rules.length"
          :for="`filter-${i.id}`"
          select-none
          border="~ solid rounded"
          px2 py0.5 text-sm flex
          :class="filter === i.id ? 'text-$vp-c-brand bg-$vp-c-brand-soft border-color-$vp-c-brand-soft' : 'border-base text-gray op75'"
        >
          <input :id="`filter-${i.id}`" v-model="filter" type="radio" :value="i.id" hidden>
          {{ i.name }}
          <div text-xs translate-y--1px translate-x-2px op50>{{ i.rules.length }}</div>
        </label>
      </template>
    </div>
  </div>

  <table
    v-if="searchResult.length"
    important="my-0 w-full table"
  >
    <thead>
      <tr>
        <td>Rule</td>
        <td>Description</td>
        <td />
        <td />
      </tr>
    </thead>

    <tbody>
      <RuleItem
        v-for="rule of searchResult"
        :key="rule.name"
        :rule="rule"
        :package="pkg"
      />
    </tbody>
  </table>
  <div
    v-else
    flex="~ items-center justify-center"
    border="~ solid base rounded-b"
    p4
  >
    <span italic op50>
      No rules found.
    </span>
  </div>

  <div
    flex="~ gap-2 items-center"
    border="x b x-solid b-solid base rounded-b"
    px4 py2
  >
    <template v-if="searchResult.length !== pkg.rules.length">
      <div text-sm op50>
        Showing {{ searchResult.length }} of {{ pkg.rules.length }} rules.
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
