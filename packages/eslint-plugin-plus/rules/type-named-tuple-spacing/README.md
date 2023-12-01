Expect space before the type declaration in the named tuple.

## Rule Details

Expect space before the type declaration in the named tuple.

## Options

This rule has no options.

Examples of **incorrect** code for this rule:

:::incorrect

```ts
/*eslint type-named-tuple-spacing: ["error"]*/

type T = [i:number]
type T = [i?   :number]
type T = [i:()=>void, j:number]
```

:::

Examples of **correct** code for this rule:

:::correct

```ts
/*eslint type-named-tuple-spacing: ["error"]*/

type T = [i: number]
type T = [i?: number]
type T = [i: ()=>void, j: number]
```

:::
