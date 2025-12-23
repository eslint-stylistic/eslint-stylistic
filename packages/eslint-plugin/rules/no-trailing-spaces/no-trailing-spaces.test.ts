/**
 * @fileoverview Disallow trailing spaces at the end of lines.
 * @author Nodeca Team <https://github.com/nodeca>
 */
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './no-trailing-spaces'

run<RuleOptions, MessageIds>({
  name: 'no-trailing-spaces',
  rule,

  valid: [
    {
      code: 'var a = 5;',
      options: [{}],
    },
    {
      code: 'var a = 5,\n    b = 3;',
      options: [{}],
    },
    'var a = 5;',
    'var a = 5,\n    b = 3;',
    {
      code: 'var a = 5,\n    b = 3;',
      options: [{ skipBlankLines: true }],
    },
    {
      code: '     ',
      options: [{ skipBlankLines: true }],
    },
    {
      code: '\t',
      options: [{ skipBlankLines: true }],
    },
    {
      code: '     \n    var c = 1;',
      options: [{ skipBlankLines: true }],
    },
    {
      code: '\t\n\tvar c = 2;',
      options: [{ skipBlankLines: true }],
    },
    {
      code: '\n   var c = 3;',
      options: [{ skipBlankLines: true }],
    },
    {
      code: '\n\tvar c = 4;',
      options: [{ skipBlankLines: true }],
    },
    {
      code: 'let str = `${a}\n   \n${b}`;',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'let str = `${a}\n   \n${b}`;\n   \n   ',
      options: [{ skipBlankLines: true }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: '// Trailing comment test. ',
      options: [{ ignoreComments: true }],
    },
    {
      code: '// Trailing comment test.',
      options: [{ ignoreComments: false }],
    },
    {
      code: '// Trailing comment test.',
      options: [],
    },
    {
      code: '/* \nTrailing comments test. \n*/',
      options: [{ ignoreComments: true }],
    },
    {
      code: '#!/usr/bin/env node ',
      options: [{ ignoreComments: true }],
    },
    {
      code: '/* \n */ // ',
      options: [{ ignoreComments: true }],
    },
    {
      code: '/* \n */ /* \n */',
      options: [{ ignoreComments: true }],
    },

    // Tests for ignoreMarkdownLineBreaks option - valid cases

    // ignoreMarkdownLineBreaks: "comments" - only works in block/multiline comments
    {
      // Markdown line break in JSDoc block comment
      code: '/**\n * first line  \n * second line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
    },
    {
      // Multiple markdown line breaks in block comment
      code: '/**\n * line one  \n * line two  \n * line three\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
    },
    {
      // Markdown line break in regular block comment
      code: '/*\nfirst line  \nsecond line\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
    },
    {
      // No trailing spaces is still valid
      code: 'var a = 5;\nvar b = 3;',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
    },

    // ignoreMarkdownLineBreaks: "always" - works everywhere (for .md files)
    {
      // Markdown line break in block comment with "always" mode
      code: '/*\nfirst line  \nsecond line\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'always' }],
    },
    {
      // Multiple markdown line breaks in block comment
      code: '/*\nline one  \nline two  \nline three\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'always' }],
    },
    {
      // Markdown line break in comment with "always" mode
      code: '/**\n * first line  \n * second line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'always' }],
    },
  ],

  invalid: [
    {
      code:
            'var short2 = true;\r\n'
            + '\r\n'
            + 'module.exports = {\r\n'
            + '  short: short,    \r\n'
            + '  short2: short\r\n'
            + '}',
      output:
            'var short2 = true;\r\n'
            + '\r\n'
            + 'module.exports = {\r\n'
            + '  short: short,\r\n'
            + '  short2: short\r\n'
            + '}',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code:
            'var short2 = true;\n'
            + '\r\n'
            + 'module.exports = {\r\n'
            + '  short: short,    \r\n'
            + '  short2: short\n'
            + '}',
      output:
            'var short2 = true;\n'
            + '\r\n'
            + 'module.exports = {\r\n'
            + '  short: short,\r\n'
            + '  short2: short\n'
            + '}',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code:
            'var short2 = true;\n'
            + '\n'
            + 'module.exports = {\n'
            + '  short: short,    \n'
            + '  short2: short\n'
            + '}\n',
      output:
            'var short2 = true;\n'
            + '\n'
            + 'module.exports = {\n'
            + '  short: short,\n'
            + '  short2: short\n'
            + '}\n',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code:
            'var short2 = true;\n'
            + '\n'
            + 'module.exports = {\n'
            + '  short,    \n'
            + '  short2\n'
            + '}\n',
      output:
            'var short2 = true;\n'
            + '\n'
            + 'module.exports = {\n'
            + '  short,\n'
            + '  short2\n'
            + '}\n',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code:
            '\n'
            + 'measAr.push("<dl></dl>",  \n'
            + '         " </dt><dd class =\'pta-res\'>");',
      output:
            '\n'
            + 'measAr.push("<dl></dl>",\n'
            + '         " </dt><dd class =\'pta-res\'>");',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code:
            'measAr.push("<dl></dl>",  \n'
            + '         " </dt><dd class =\'pta-res\'>");',
      output:
            'measAr.push("<dl></dl>",\n'
            + '         " </dt><dd class =\'pta-res\'>");',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = 5;      \n',
      output: 'var a = 5;\n',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = 5; \n b = 3; ',
      output: 'var a = 5;\n b = 3;',
      errors: [{
        messageId: 'trailingSpace',
      }, {
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = 5; \n\n b = 3; ',
      output: 'var a = 5;\n\n b = 3;',
      errors: [{
        messageId: 'trailingSpace',
      }, {
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = 5;\t\n  b = 3;',
      output: 'var a = 5;\n  b = 3;',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: '     \n    var c = 1;',
      output: '\n    var c = 1;',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: '\t\n\tvar c = 2;',
      output: '\n\tvar c = 2;',
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = 5;      \n',
      output: 'var a = 5;\n',
      options: [{}],
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = 5; \n b = 3; ',
      output: 'var a = 5;\n b = 3;',
      options: [{}],
      errors: [{
        messageId: 'trailingSpace',
        line: 1,
        column: 11,
        endLine: 1,
        endColumn: 12,
      }, {
        messageId: 'trailingSpace',
        line: 2,
        column: 8,
        endLine: 2,
        endColumn: 9,
      }],
    },
    {
      code: 'var a = 5;\t\n  b = 3;',
      output: 'var a = 5;\n  b = 3;',
      options: [{}],
      errors: [{
        messageId: 'trailingSpace',
        line: 1,
        column: 11,
        endLine: 1,
        endColumn: 12,
      }],
    },
    {
      code: '     \n    var c = 1;',
      output: '\n    var c = 1;',
      options: [{}],
      errors: [{
        messageId: 'trailingSpace',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 6,
      }],
    },
    {
      code: '\t\n\tvar c = 2;',
      output: '\n\tvar c = 2;',
      options: [{}],
      errors: [{
        messageId: 'trailingSpace',
      }],
    },
    {
      code: 'var a = \'bar\';  \n \n\t',
      output: 'var a = \'bar\';\n \n\t',
      options: [{
        skipBlankLines: true,
      }],
      errors: [{
        messageId: 'trailingSpace',
        line: 1,
        column: 15, // there are invalid spaces in columns 15 and 16
        endLine: 1,
        endColumn: 17,
      }],
    },
    {
      code: 'var a = \'foo\';   \nvar b = \'bar\';  \n  \n',
      output: 'var a = \'foo\';\nvar b = \'bar\';\n  \n',
      options: [{
        skipBlankLines: true,
      }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18,
        },
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 17,
        },
      ],
    },
    {
      code: 'let str = `${a}\n  \n${b}`;  \n',
      output: 'let str = `${a}\n  \n${b}`;\n',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'trailingSpace',
        line: 3,
        column: 7,
        endLine: 3,
        endColumn: 9,
      }],
    },
    {
      code: 'let str = `\n${a}\n  \n${b}`;  \n\t',
      output: 'let str = `\n${a}\n  \n${b}`;\n',
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'trailingSpace',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 9,
        },
        {
          messageId: 'trailingSpace',
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 2,
        },
      ],
    },
    {
      code: 'let str = `  \n  ${a}\n  \n${b}`;  \n',
      output: 'let str = `  \n  ${a}\n  \n${b}`;\n',
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'trailingSpace',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 9,
        },
      ],
    },
    {
      code: 'let str = `${a}\n  \n${b}`;  \n  \n',
      output: 'let str = `${a}\n  \n${b}`;\n  \n',
      options: [{
        skipBlankLines: true,
      }],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'trailingSpace',
          line: 3,
          column: 7,
          endLine: 3,
          endColumn: 9,
        },
      ],
    },

    // https://github.com/eslint/eslint/issues/6933
    {
      code: '    \nabcdefg ',
      output: '    \nabcdefg',
      options: [{ skipBlankLines: true }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 8,
          endLine: 2,
          endColumn: 9,
        },
      ],
    },
    {
      code: '    \nabcdefg ',
      output: '\nabcdefg',
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 5,
        },
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 8,
          endLine: 2,
          endColumn: 9,
        },
      ],
    },

    // Tests for ignoreComments flag.
    {
      code: 'var foo = \'bar\'; ',
      output: 'var foo = \'bar\';',
      options: [{ ignoreComments: true }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 18,
        },
      ],
    },
    {
      code: '/* */ ',
      output: '/* */',
      options: [{ ignoreComments: true }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: '/* */foo ',
      output: '/* */foo',
      options: [{ ignoreComments: true }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 9,
        },
      ],
    },
    {
      code: '/* \n */ ',
      output: '/* \n */',
      options: [{ ignoreComments: true }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 4,
        },
      ],
    },
    {
      code: '/* \n */ foo ',
      output: '/* \n */ foo',
      options: [{ ignoreComments: true }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 8,
        },
      ],
    },
    {
      code: '// Trailing comment test. ',
      output: '// Trailing comment test.',
      options: [{ ignoreComments: false }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 27,
        },
      ],
    },
    {
      code: '/* \nTrailing comments test. \n*/',
      output: '/*\nTrailing comments test.\n*/',
      options: [{ ignoreComments: false }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 3,
          endLine: 1,
          endColumn: 4,
        },
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 25,
        },
      ],
    },
    {
      code: '#!/usr/bin/env node ',
      output: '#!/usr/bin/env node',
      options: [{ ignoreComments: false }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },
    {
      code: '// Trailing comment default test. ',
      output: '// Trailing comment default test.',
      options: [],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 35,
        },
      ],
    },

    // Tests for ignoreMarkdownLineBreaks option - invalid cases

    // ignoreMarkdownLineBreaks: "comments" - NOT allowed in regular code or single-line comments
    {
      // Two trailing spaces in regular code is still invalid with "comments" mode
      code: 'var a = 5;  \nvar b = 3;',
      output: 'var a = 5;\nvar b = 3;',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 13,
        },
      ],
    },
    {
      // Two trailing spaces in single-line comment is NOT allowed (only block comments)
      code: '// first line  \n// second line',
      output: '// first line\n// second line',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 16,
        },
      ],
    },
    {
      // One trailing space in comment is not valid markdown
      code: '/**\n * first line \n * second line\n */',
      output: '/**\n * first line\n * second line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 14,
          endLine: 2,
          endColumn: 15,
        },
      ],
    },
    {
      // Three trailing spaces in comment is not valid markdown line break
      code: '/**\n * first line   \n * second line\n */',
      output: '/**\n * first line\n * second line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 14,
          endLine: 2,
          endColumn: 17,
        },
      ],
    },
    {
      // Trailing tab in comment is not valid markdown
      code: '/**\n * first line\t\n * second line\n */',
      output: '/**\n * first line\n * second line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 14,
          endLine: 2,
          endColumn: 15,
        },
      ],
    },
    {
      // Two spaces before empty line in comment is not valid markdown line break
      code: '/**\n * first line  \n *\n * third line\n */',
      output: '/**\n * first line\n *\n * third line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 14,
          endLine: 2,
          endColumn: 16,
        },
      ],
    },
    {
      // Two spaces at end of comment (before closing) is not valid
      code: '/**\n * last line  \n */',
      output: '/**\n * last line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 13,
          endLine: 2,
          endColumn: 15,
        },
      ],
    },
    {
      // Two spaces before line with only whitespace in comment is not valid
      code: '/**\n * first  \n *   \n * third\n */',
      output: '/**\n * first\n *\n * third\n */',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 11,
        },
        {
          messageId: 'trailingSpace',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 6,
        },
      ],
    },
    {
      // Mixed: valid markdown in comment + invalid trailing space in code
      code: '/**\n * line one  \n * line two\n */\nvar x = 1;  ',
      output: '/**\n * line one  \n * line two\n */\nvar x = 1;',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 13,
        },
      ],
    },
    {
      // String literal with trailing spaces - should still be flagged
      code: 'var s = "hello";  \nvar t = "world";',
      output: 'var s = "hello";\nvar t = "world";',
      options: [{ ignoreMarkdownLineBreaks: 'comments' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },

    // ignoreMarkdownLineBreaks: "always" - still validates markdown format
    {
      // One trailing space is not valid markdown even with "always"
      code: '/*\nfirst line \nsecond line\n*/',
      output: '/*\nfirst line\nsecond line\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'always' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 12,
        },
      ],
    },
    {
      // Three trailing spaces is not valid markdown
      code: '/*\nfirst line   \nsecond line\n*/',
      output: '/*\nfirst line\nsecond line\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'always' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 14,
        },
      ],
    },
    {
      // Two spaces before closing comment line is not valid markdown
      code: '/*\nlast line  \n*/',
      output: '/*\nlast line\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'always' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 12,
        },
      ],
    },

    // ignoreMarkdownLineBreaks: "never" - no markdown line breaks allowed (default behavior)
    {
      // Two trailing spaces flagged with "never"
      code: '/*\nfirst line  \nsecond line\n*/',
      output: '/*\nfirst line\nsecond line\n*/',
      options: [{ ignoreMarkdownLineBreaks: 'never' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 13,
        },
      ],
    },
    {
      // Two trailing spaces in comment flagged with "never"
      code: '/**\n * first line  \n * second line\n */',
      output: '/**\n * first line\n * second line\n */',
      options: [{ ignoreMarkdownLineBreaks: 'never' }],
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 14,
          endLine: 2,
          endColumn: 16,
        },
      ],
    },
  ],
})
