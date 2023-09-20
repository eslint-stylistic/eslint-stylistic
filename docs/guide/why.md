# Why?

This project was initiated as ESLint and `typescript-eslint` teams [decided to deprecate formatting/stylistic-related rules](https://github.com/eslint/eslint/issues/17522) from their core due to the **maintenance cost**. This project ports those rules and distributes them as separate packages. We will keep them maintained as the community.

## Linters vs. Formatters

You might have seen some discussions discouraging using ESLint to format source code, as Linters and Formatters are tools in different scopes. While we generally agree that ESLint would not be the most efficient tool to do formatting, we see that currently ESLint with auto-fix is still the best tool to do **source code** formatting, as it provides fine-grained control of each rule, having incredible extensibility, and respects the input of the source code.

The popular formatters like [Prettier](https://github.com/prettier/prettier) and [dprint](https://dprint.dev/) are great on formatting code. However, the main issue we see is that their ["read-and-reprints"](https://prettier.io/docs/en/) approach **throw away all the stylistic information from the source code**, meaning that we can't preserve the styles that we consider more "human-readable".

Here are two examples that Prettier and dprint would force the code wrap/unwrap due to the fixed `printWidth` options. Not only it makes the code less visually readable, it also creates unnecessary wrapping/unwrapping diff in version control when changing the length of content.

![](/images/format-prettier.png)

![](/images/format-dprint.png)

This behaviour is [mandatory](https://github.com/prettier/prettier/issues/3468) as it's the side-effect for their approach fundamentally.

With stylistic rules in ESLint, we are able to achieve similar formatting compatibility while retain the original code style as the authors/teams' intention, and doing the fix in one-go.

This project is maintained for those who cares such details and want to have full control of the code style.

If you are interested in learning more, we recommended reading [Anthony Fu](https://antfu.me/)'s [*Why I don't use Prettier*](https://antfu.me/posts/why-not-prettier) post.
