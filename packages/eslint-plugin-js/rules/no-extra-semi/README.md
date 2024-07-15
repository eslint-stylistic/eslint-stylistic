---
title: no-extra-semi
rule_type: suggestion
related_rules:
  - semi
  - semi-spacing
---

# js/no-extra-semi

Typing mistakes and misunderstandings about where semicolons are required can lead to semicolons that are unnecessary. While not technically an error, extra semicolons can cause confusion when reading code.

## Rule Details

This rule disallows unnecessary semicolons.

Problems reported by this rule can be fixed automatically, except when removing a semicolon would cause a following statement to become a directive such as `"use strict"`.

This rule adds support for class properties.

Note that this rule is classified as a "Suggestion" rule instead of a "Layout & Formatting" rule because [adding extra semi-colons actually changes the AST of the program](https://typescript-eslint.io/play/#ts=5.1.6&showAST=es&fileType=.ts&code=MYewdgzgLgBAHjAvDAjAbg0A&eslintrc=N4KABGBEBOCuA2BTAzpAXGUEKQHYHsBaRADwBdoBDQ5RAWwEt0p8AzVyAGnG0gAEyATwAOKAMbQGwssWTwGuMgHoCxclRr0mGSImjR80SDwC%2BIE0A&tsconfig=&tokens=false). With that said, modern TypeScript formatters will remove extra semi-colons automatically during the formatting process. Thus, if you [use a formatter](/linting/troubleshooting/formatting), then enabling this rule is probably unnecessary.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-extra-semi: "error"*/

var x = 5;;

function foo() {
    // code
};

class C {
    field;;

    method() {
        // code
    };

    static {
        // code
    };
};
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-extra-semi: "error"*/

var x = 5;

function foo() {
    // code
}

var bar = function() {
    // code
};

class C {
    field;

    method() {
        // code
    }

    static {
        // code
    }
}
```

:::

## When Not To Use It

If you intentionally use extra semicolons then you can disable this rule.
