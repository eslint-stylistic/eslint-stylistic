/**
 * @fileoverview enforce the location of arrow function bodies
 * @author Sharmila Jesupaul
 */

import type { RuleOptions } from './types'
import { $, run } from '#test'
import rule from '.'

const EXPECTED_LINEBREAK = { messageId: 'expected' }
const UNEXPECTED_LINEBREAK = { messageId: 'unexpected' }

run<RuleOptions>({
  name: 'implicit-arrow-linebreak',
  rule,
  valid: [
    // always valid
    `(foo) => {
        bar
    }`,

    // 'beside' option
    '() => bar;',
    '() => (bar);',
    '() => bar => baz;',
    '() => ((((bar))));',
    `(foo) => (
        bar
    )`,
    '(foo) => bar();',
    `
    //comment
    foo => bar;
    `,
    `
    foo => (
        // comment
        bar => (
            // another comment
            baz
        )
    )
    `,
    `
    foo => (
        // comment
        bar => baz
    )
    `,
    `
    /* text */
    () => bar;
    `,
    `
    /* foo */
    const bar = () => baz;
    `,
    `
    (foo) => (
            //comment
                bar
            )
    `,
    `
      [ // comment
        foo => 'bar'
      ]
    `,
    `
      /**
     One two three four
      Five six seven nine.
      */
      (foo) => bar
    `,
    `
    const foo = {
      id: 'bar',
      // comment
      prop: (foo1) => 'returning this string',
    }
    `,
    `
    // comment
      "foo".split('').map((char) => char
      )
    `,
    {
      code: $`
        async foo => () => bar;
      `,
      parserOptions: { ecmaVersion: 8 },
    },
    {
      code: $`
        // comment
        async foo => 'string'
      `,
      parserOptions: { ecmaVersion: 8 },
    },

    // 'below' option
    {
      code: $`
        (foo) =>
            (
                bar
            )
      `,
      options: ['below'],
    },
    {
      code: $`
        () =>
            ((((bar))));
      `,
      options: ['below'],
    },
    {
      code: $`
        () =>
            bar();
      `,
      options: ['below'],
    },
    {
      code: $`
        () =>
            (bar);
      `,
      options: ['below'],
    },
    {
      code: $`
        () =>
            bar =>
                baz;
      `,
      options: ['below'],
    },
  ],

  invalid: [

    // 'beside' option
    {
      code: $`
        (foo) =>
            bar();
      `,
      output: $`
        (foo) => bar();
      `,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        () =>
            (bar);
      `,
      output: $`
        () => (bar);
      `,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        () =>
            bar =>
                baz;
      `,
      output: $`
        () => bar => baz;
      `,
      errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        () =>
            ((((bar))));
      `,
      output: $`
        () => ((((bar))));
      `,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
            (
                bar
            )
      `,
      output: $`
        (foo) => (
                bar
            )
      `,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
          // test comment
          bar
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        const foo = () =>
        // comment
        []
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
            (
            //comment
                bar
            )
      `,
      output: $`
        (foo) => (
            //comment
                bar
            )
      `,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
            (
                bar
            //comment
            )
      `,
      output: $`
        (foo) => (
                bar
            //comment
            )
      `,
      errors: [UNEXPECTED_LINEBREAK],

    },
    {
      code: $`
        (foo) =>
         // comment
         // another comment
            bar
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
        // comment
        (
        // another comment
        bar
        )
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: '() => // comment \n bar',
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: '(foo) => //comment \n bar',
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
          /* test comment */
          bar
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
          // hi
             bar =>
               // there
                 baz;
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) =>
          // hi
             bar => (
               // there
                 baz
             )
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        const foo = {
          id: 'bar',
          prop: (foo1) =>
            // comment
            'returning this string',
        }
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        [ foo =>
          // comment
          'bar'
        ]
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        "foo".split('').map((char) =>
        // comment
        char
        )
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        new Promise((resolve, reject) =>
            // comment
            resolve()
        )
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        () =>
        /**
        succinct
        explanation
        of code
        */
        bar
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        stepOne =>
            /**
            here is
            what is
            happening
            */
            stepTwo =>
                // then this happens
                stepThree
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        () =>
            /**
            multi
            line
            */
            bar =>
                /**
                many
                lines
                */
                baz
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        foo('', boo =>
          // comment
          bar
        )
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        async foo =>
            // comment
            'string'
      `,
      output: null,
      parserOptions: { ecmaVersion: 8 },
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        async foo =>
            // comment
            // another
            bar;
      `,
      output: null,
      parserOptions: { ecmaVersion: 8 },
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        async (foo) =>
            // comment
            'string'
      `,
      output: null,
      parserOptions: { ecmaVersion: 8 },
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        const foo = 1,
          bar = 2,
          baz = () => // comment
            qux
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        const foo = () =>
          //comment
          qux,
          bar = 2,
          baz = 3
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        const foo = () =>
            //two
            1,
            boo = () =>
            //comment
            2,
            bop = "what"
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        start()
            .then(() =>
                /* If I put a comment here, eslint --fix breaks badly */
                process && typeof process.send === 'function' && process.send('ready')
            )
            .catch(err => {
            /* catch seems to be needed here */
            console.log('Error: ', err)
            })
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        hello(response =>
            // comment
            response, param => param)
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },
    {
      code: $`
        start(
            arr =>
                // cometh
                bod => {
                    // soon
                    yyyy
                }
        )
      `,
      output: null,
      errors: [UNEXPECTED_LINEBREAK],
    },

    // 'below' option
    {
      code: '(foo) => bar();',
      output: '(foo) => \nbar();',
      options: ['below'],
      errors: [EXPECTED_LINEBREAK],
    },
    {
      code: '(foo) => bar => baz;',
      output: '(foo) => \nbar => \nbaz;',
      options: ['below'],
      errors: [EXPECTED_LINEBREAK, EXPECTED_LINEBREAK],
    },
    {
      code: '(foo) => (bar);',
      output: '(foo) => \n(bar);',
      options: ['below'],
      errors: [EXPECTED_LINEBREAK],
    },
    {
      code: '(foo) => (((bar)));',
      output: '(foo) => \n(((bar)));',
      options: ['below'],
      errors: [EXPECTED_LINEBREAK],
    },
    {
      code: $`
        (foo) => (
            bar
        )
      `,
      output: $`
        (foo) => 
        (
            bar
        )
      `,
      options: ['below'],
      errors: [EXPECTED_LINEBREAK],
    },
  ],
})
