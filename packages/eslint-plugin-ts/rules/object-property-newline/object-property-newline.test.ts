import rule from './object-property-newline'
import { run } from '#test'

run({
  name: 'object-property-newline',
  rule,
  valid: [
    ...[
      `
interface Foo {
    id: number;
    name: string;
    age: number;
}
      `,
      `
type Foo = {
    id: number;
    name: string;
    age: number;
}
      `,
    ].flatMap(code => [
      code,
      { code, options: [{ allowAllPropertiesOnSameLine: false }] },
      /* deprecated */ { code, options: [{ allowMultiplePropertiesPerLine: false }] },
      { code, options: [{ allowAllPropertiesOnSameLine: true }] },
      /* deprecated */ { code, options: [{ allowMultiplePropertiesPerLine: true }] },
    ]),
    ...[
      `
interface Foo {   id: number;
    name: string;
    age: number; }
      `,
      `
type Foo = {   id: number;
    name: string;
    age: number; }
      `,
    ].flatMap(code => [
      code,
      { code, options: [{ allowAllPropertiesOnSameLine: false }] },
      /* deprecated */ { code, options: [{ allowMultiplePropertiesPerLine: false }] },
    ]),
    ...[
      `
interface Foo { id: number; name: string; age: number; }
      `,
      `
type Foo = { id: number; name: string; age: number; }
      `,
    ].flatMap(code => [
      { code, options: [{ allowAllPropertiesOnSameLine: true }] },
      /* deprecated */{ code, options: [{ allowMultiplePropertiesPerLine: true }] },
    ]),
  ],

  invalid: [
    ...[
      {
        code: `
interface Foo {   id: number; name: string;
    age: number; }
        `,
        output: `
interface Foo {   id: number;
name: string;
    age: number; }
        `,
        errors: [
          {
            messageId: 'propertiesOnNewline',
            line: 2,
            column: 31,
          },
        ],
      },
      {
        code: `
type Foo = {   id: number; name: string;
    age: number; }
      `,
        output: `
type Foo = {   id: number;
name: string;
    age: number; }
      `,
        errors: [
          {
            messageId: 'propertiesOnNewline',
            line: 2,
            column: 28,
          },
        ],
      },
      {
        code: `
interface Foo {
    id: number; name: string;
    age: number; }
      `,
        output: `
interface Foo {
    id: number;
name: string;
    age: number; }
      `,
        errors: [
          {
            messageId: 'propertiesOnNewline',
            line: 3,
            column: 17,
          },
        ],
      },
      {
        code: `
type Foo = {
    id: number; name: string;
    age: number; }
      `,
        output: `
type Foo = {
    id: number;
name: string;
    age: number; }
      `,
        errors: [
          {
            messageId: 'propertiesOnNewline',
            line: 3,
            column: 17,
          },
        ],
      },
    ].flatMap(c => [
      { ...c, options: [] },
      { ...c, options: [{ allowAllPropertiesOnSameLine: false }] },
      /* deprecated */ { ...c, options: [{ allowMultiplePropertiesPerLine: false }] },
      { ...c, errors: c.errors.map(e => ({ ...e, messageId: 'propertiesOnNewlineAll' })), options: [{ allowAllPropertiesOnSameLine: true }] },
      /* deprecated */ { ...c, errors: c.errors.map(e => ({ ...e, messageId: 'propertiesOnNewlineAll' })), options: [{ allowMultiplePropertiesPerLine: true }] },
    ]),
    ...[
      {
        code: `
interface Foo { id: number; name: string; age: number; }
      `,
        output: `
interface Foo { id: number;
name: string;
age: number; }
      `,
        errors: [
          {
            messageId: 'propertiesOnNewline',
            line: 2,
            column: 29,
          },
          {
            messageId: 'propertiesOnNewline',
            line: 2,
            column: 43,
          },
        ],
      },
      {
        code: `
type Foo = { id: number; name: string; age: number; }
      `,
        output: `
type Foo = { id: number;
name: string;
age: number; }
      `,
        errors: [
          {
            messageId: 'propertiesOnNewline',
            line: 2,
            column: 26,
          },
          {
            messageId: 'propertiesOnNewline',
            line: 2,
            column: 40,
          },
        ],
      },
    ].flatMap(c => [
      { ...c, options: [] },
      { ...c, options: [{ allowAllPropertiesOnSameLine: false }] },
      /* deprecated */ { ...c, options: [{ allowMultiplePropertiesPerLine: false }] },
    ]),
  ],
})
