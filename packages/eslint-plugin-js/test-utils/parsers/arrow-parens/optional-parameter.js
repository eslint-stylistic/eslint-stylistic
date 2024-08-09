'use strict'

// @typescript-eslint/parser@8.0.1
// (a?) => a

exports.parse = () => ({
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'ArrowFunctionExpression',
        generator: false,
        id: null,
        params: [
          {
            type: 'Identifier',
            decorators: [],
            name: 'a',
            optional: true,
            range: [
              1,
              3,
            ],
            loc: {
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 3,
              },
            },
          },
        ],
        body: {
          type: 'Identifier',
          decorators: [],
          name: 'a',
          optional: false,
          range: [
            8,
            9,
          ],
          loc: {
            start: {
              line: 1,
              column: 8,
            },
            end: {
              line: 1,
              column: 9,
            },
          },
        },
        async: false,
        expression: true,
        range: [
          0,
          9,
        ],
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 9,
          },
        },
      },
      range: [
        0,
        9,
      ],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 9,
        },
      },
    },
  ],
  comments: [],
  range: [
    0,
    9,
  ],
  sourceType: 'module',
  tokens: [
    {
      type: 'Punctuator',
      value: '(',
      range: [
        0,
        1,
      ],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 1,
        },
      },
    },
    {
      type: 'Identifier',
      value: 'a',
      range: [
        1,
        2,
      ],
      loc: {
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 2,
        },
      },
    },
    {
      type: 'Punctuator',
      value: '?',
      range: [
        2,
        3,
      ],
      loc: {
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: 1,
          column: 3,
        },
      },
    },
    {
      type: 'Punctuator',
      value: ')',
      range: [
        3,
        4,
      ],
      loc: {
        start: {
          line: 1,
          column: 3,
        },
        end: {
          line: 1,
          column: 4,
        },
      },
    },
    {
      type: 'Punctuator',
      value: '=>',
      range: [
        5,
        7,
      ],
      loc: {
        start: {
          line: 1,
          column: 5,
        },
        end: {
          line: 1,
          column: 7,
        },
      },
    },
    {
      type: 'Identifier',
      value: 'a',
      range: [
        8,
        9,
      ],
      loc: {
        start: {
          line: 1,
          column: 8,
        },
        end: {
          line: 1,
          column: 9,
        },
      },
    },
  ],
  loc: {
    start: {
      line: 1,
      column: 0,
    },
    end: {
      line: 1,
      column: 9,
    },
  },
})
