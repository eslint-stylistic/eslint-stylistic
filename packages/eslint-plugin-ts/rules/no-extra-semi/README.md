---
description: 'Disallow unnecessary semicolons.'
---

This rule extends the base [`no-extra-semi`](/rules/js/no-extra-semi) rule.
It adds support for class properties.

Note that this rule is classified as a "Suggestion" rule instead of a "Layout & Formatting" rule because [adding extra semi-colons actually changes the AST of the program](https://typescript-eslint.io/play/#ts=5.1.6&showAST=es&fileType=.ts&code=MYewdgzgLgBAHjAvDAjAbg0A&eslintrc=N4KABGBEBOCuA2BTAzpAXGUEKQHYHsBaRADwBdoBDQ5RAWwEt0p8AzVyAGnG0gAEyATwAOKAMbQGwssWTwGuMgHoCxclRr0mGSImjR80SDwC%2BIE0A&tsconfig=&tokens=false). With that said, modern TypeScript formatters will remove extra semi-colons automatically during the formatting process. Thus, if you [use a formatter](/linting/troubleshooting/formatting), then enabling this rule is probably unnecessary.
