'use strict'

// (a: T) => a

exports.parse = () => ({
  type: 'Program',
  start: 0,
  end: 11,
  loc: {
    start: {
      line: 1,
      column: 0,
    },
    end: {
      line: 1,
      column: 11,
    },
  },
  sourceType: 'module',
  body: [
    {
      type: 'ExpressionStatement',
      start: 0,
      end: 11,
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 11,
        },
      },
      expression: {
        type: 'ArrowFunctionExpression',
        start: 0,
        end: 11,
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 11,
          },
        },
        id: null,
        generator: false,
        expression: true,
        async: false,
        params: [
          {
            type: 'Identifier',
            start: 1,
            end: 2,
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
            name: 'a',
            typeAnnotation: {
              type: 'TypeAnnotation',
              start: 2,
              end: 5,
              loc: {
                start: {
                  line: 1,
                  column: 2,
                },
                end: {
                  line: 1,
                  column: 5,
                },
              },
              typeAnnotation: {
                type: 'GenericTypeAnnotation',
                start: 4,
                end: 5,
                loc: {
                  start: {
                    line: 1,
                    column: 4,
                  },
                  end: {
                    line: 1,
                    column: 5,
                  },
                },
                typeParameters: null,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  loc: {
                    start: {
                      line: 1,
                      column: 4,
                    },
                    end: {
                      line: 1,
                      column: 5,
                    },
                  },
                  name: 'T',
                  range: [
                    4,
                    5,
                  ],
                  _babelType: 'Identifier',
                },
                range: [
                  4,
                  5,
                ],
                _babelType: 'GenericTypeAnnotation',
              },
              range: [
                2,
                5,
              ],
              _babelType: 'TypeAnnotation',
            },
            range: [
              1,
              2,
            ],
            _babelType: 'Identifier',
          },
        ],
        body: {
          type: 'Identifier',
          start: 10,
          end: 11,
          loc: {
            start: {
              line: 1,
              column: 10,
            },
            end: {
              line: 1,
              column: 11,
            },
          },
          name: 'a',
          range: [
            10,
            11,
          ],
          _babelType: 'Identifier',
        },
        range: [
          0,
          11,
        ],
        _babelType: 'ArrowFunctionExpression',
      },
      range: [
        0,
        11,
      ],
      _babelType: 'ExpressionStatement',
    },
  ],
  tokens: [
    {
      type: 'Punctuator',
      value: '(',
      start: 0,
      end: 1,
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
      range: [
        0,
        1,
      ],
    },
    {
      type: 'Identifier',
      value: 'a',
      start: 1,
      end: 2,
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
      range: [
        1,
        2,
      ],
    },
    {
      type: 'Punctuator',
      value: ':',
      start: 2,
      end: 3,
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
      range: [
        2,
        3,
      ],
    },
    {
      type: 'Identifier',
      value: 'T',
      start: 4,
      end: 5,
      loc: {
        start: {
          line: 1,
          column: 4,
        },
        end: {
          line: 1,
          column: 5,
        },
      },
      range: [
        4,
        5,
      ],
    },
    {
      type: 'Punctuator',
      value: ')',
      start: 5,
      end: 6,
      loc: {
        start: {
          line: 1,
          column: 5,
        },
        end: {
          line: 1,
          column: 6,
        },
      },
      range: [
        5,
        6,
      ],
    },
    {
      type: 'Punctuator',
      value: '=>',
      start: 7,
      end: 9,
      loc: {
        start: {
          line: 1,
          column: 7,
        },
        end: {
          line: 1,
          column: 9,
        },
      },
      range: [
        7,
        9,
      ],
    },
    {
      type: 'Identifier',
      value: 'a',
      start: 10,
      end: 11,
      loc: {
        start: {
          line: 1,
          column: 10,
        },
        end: {
          line: 1,
          column: 11,
        },
      },
      range: [
        10,
        11,
      ],
    },
    {
      type: {
        label: 'eof',
        beforeExpr: false,
        startsExpr: false,
        rightAssociative: false,
        isLoop: false,
        isAssign: false,
        prefix: false,
        postfix: false,
        binop: null,
        updateContext: null,
      },
      start: 11,
      end: 11,
      loc: {
        start: {
          line: 1,
          column: 11,
        },
        end: {
          line: 1,
          column: 11,
        },
      },
      range: [
        11,
        11,
      ],
    },
  ],
  comments: [],
  range: [
    0,
    11,
  ],
})
