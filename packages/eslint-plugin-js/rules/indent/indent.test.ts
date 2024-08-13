/**
 * @fileoverview This option sets a specific tab width for your code
 * @author Dmitriy Shekhovtsov
 * @author Gyandeep Singh
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import parser from '../../test-utils/fixture-parser'
import tsParser from '@typescript-eslint/parser'
import rule from './indent'
import { $, run } from '#test'

const fixture = readFileSync(join(__dirname, './fixtures/indent-invalid-fixture-1.js'), 'utf8')
const fixedFixture = readFileSync(join(__dirname, './fixtures/indent-valid-fixture-1.js'), 'utf8')

type ErrorInput = [number, number | string, number | string, string]
interface ErrorOutput {
  messageId: string
  data: {
    expected: string
    actual: string | number
  }
  type: string
  line: number
}

/**
 * Create error message object for failure cases with a single 'found' indentation type
 */
export function expectedErrors(providedErrors: ErrorInput | ErrorInput[]): ErrorOutput[]
export function expectedErrors(providedIndentType: 'space' | 'tab', providedErrors: ErrorInput | ErrorInput[]): ErrorOutput[]
export function expectedErrors(providedIndentType: any, providedErrors?: any): ErrorOutput[] {
  let indentType: 'space' | 'tab'
  let errors: Array<[number, number, number, string]>

  if (Array.isArray(providedIndentType)) {
    errors = Array.isArray(providedIndentType[0]) ? providedIndentType : [providedIndentType]
    indentType = 'space'
  }
  else {
    errors = Array.isArray(providedErrors[0]) ? providedErrors : [providedErrors]
    indentType = providedIndentType
  }

  return errors.map<ErrorOutput>(err => ({
    messageId: 'wrongIndentation',
    data: {
      expected: typeof err[1] === 'string' && typeof err[2] === 'string'
        ? err[1]
        : `${err[1]} ${indentType}${err[1] === 1 ? '' : 's'}`,
      actual: err[2],
    },
    type: err[3],
    line: err[0],
  }))
}

run({
  name: 'indent',
  rule,
  lang: 'js',
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  valid: [
    {
      code: $`
        bridge.callHandler(
          'getAppVersion', 'test23', function(responseData) {
            window.ah.mobileAppVersion = responseData;
          }
        );
      `,
      options: [2],
    },
    {
      code: $`
        bridge.callHandler(
          'getAppVersion', 'test23', function(responseData) {
            window.ah.mobileAppVersion = responseData;
          });
      `,
      options: [2],
    },
    {
      code: $`
        bridge.callHandler(
          'getAppVersion',
          null,
          function responseCallback(responseData) {
            window.ah.mobileAppVersion = responseData;
          }
        );
      `,
      options: [2],
    },
    {
      code: $`
        bridge.callHandler(
          'getAppVersion',
          null,
          function responseCallback(responseData) {
            window.ah.mobileAppVersion = responseData;
          });
      `,
      options: [2],
    },
    {
      code: $`
        function doStuff(keys) {
            _.forEach(
                keys,
                key => {
                    doSomething(key);
                }
            );
        }
      `,
      options: [4],
    },
    {
      code: $`
        example(
            function () {
                console.log('example');
            }
        );
      `,
      options: [4],
    },
    {
      code: $`
        let foo = somethingList
            .filter(x => {
                return x;
            })
            .map(x => {
                return 100 * x;
            });
      `,
      options: [4],
    },
    {
      code: $`
        var x = 0 &&
            {
                a: 1,
                b: 2
            };
      `,
      options: [4],
    },
    {
      code: $`
        var x = 0 &&
        \t{
        \t\ta: 1,
        \t\tb: 2
        \t};
      `,
      options: ['tab'],
    },
    {
      code: $`
        var x = 0 &&
            {
                a: 1,
                b: 2
            }||
            {
                c: 3,
                d: 4
            };
      `,
      options: [4],
    },
    {
      code: $`
        var x = [
            'a',
            'b',
            'c'
        ];
      `,
      options: [4],
    },
    {
      code: $`
        var x = ['a',
            'b',
            'c',
        ];
      `,
      options: [4],
    },
    {
      code: 'var x = 0 && 1;',
      options: [4],
    },
    {
      code: 'var x = 0 && { a: 1, b: 2 };',
      options: [4],
    },
    {
      code: $`
        var x = 0 &&
            (
                1
            );
      `,
      options: [4],
    },
    {
      code: $`
        require('http').request({hostname: 'localhost',
          port: 80}, function(res) {
          res.end();
        });
      `,
      options: [2],
    },
    {
      code: $`
        function test() {
          return client.signUp(email, PASSWORD, { preVerified: true })
            .then(function (result) {
              // hi
            })
            .then(function () {
              return FunctionalHelpers.clearBrowserState(self, {
                contentServer: true,
                contentServer1: true
              });
            });
        }
      `,
      options: [2],
    },
    {
      code: $`
        it('should... some lengthy test description that is forced to be' +
          'wrapped into two lines since the line length limit is set', () => {
          expect(true).toBe(true);
        });
      `,
      options: [2],
    },
    {
      code: $`
        function test() {
            return client.signUp(email, PASSWORD, { preVerified: true })
                .then(function (result) {
                    var x = 1;
                    var y = 1;
                }, function(err){
                    var o = 1 - 2;
                    var y = 1 - 2;
                    return true;
                })
        }
      `,
      options: [4],
    },
    {

      // https://github.com/eslint/eslint/issues/11802
      code: $`
        import foo from "foo"
        
        ;(() => {})()
      `,
      options: [4],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        function test() {
            return client.signUp(email, PASSWORD, { preVerified: true })
            .then(function (result) {
                var x = 1;
                var y = 1;
            }, function(err){
                var o = 1 - 2;
                var y = 1 - 2;
                return true;
            });
        }
      `,
      options: [4, { MemberExpression: 0 }],
    },

    {
      code: '// hi',
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var Command = function() {
          var fileList = [],
              files = []
        
          files.concat(fileList)
        };
      `,
      options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
    },
    {
      code: '  ',
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        if(data) {
          console.log('hi');
          b = true;};
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        foo = () => {
          console.log('hi');
          return true;};
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        function test(data) {
          console.log('hi');
          return true;};
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var test = function(data) {
          console.log('hi');
        };
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        arr.forEach(function(data) {
          otherdata.forEach(function(zero) {
            console.log('hi');
          }) });
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        a = [
            ,3
        ]
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        [
          ['gzip', 'gunzip'],
          ['gzip', 'unzip'],
          ['deflate', 'inflate'],
          ['deflateRaw', 'inflateRaw'],
        ].forEach(function(method) {
          console.log(method);
        });
      `,
      options: [2, { SwitchCase: 1, VariableDeclarator: 2 }],
    },
    {
      code: $`
        test(123, {
            bye: {
                hi: [1,
                    {
                        b: 2
                    }
                ]
            }
        });
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var xyz = 2,
            lmn = [
                {
                    a: 1
                }
            ];
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        lmnn = [{
            a: 1
        },
        {
            b: 2
        }, {
            x: 2
        }];
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    $`
      [{
          foo: 1
      }, {
          foo: 2
      }, {
          foo: 3
      }]
    `,
    $`
      foo([
          bar
      ], [
          baz
      ], [
          qux
      ]);
    `,
    {
      code: $`
        abc({
            test: [
                [
                    c,
                    xyz,
                    2
                ].join(',')
            ]
        });
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        abc = {
          test: [
            [
              c,
              xyz,
              2
            ]
          ]
        };
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        abc(
          {
            a: 1,
            b: 2
          }
        );
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        abc({
            a: 1,
            b: 2
        });
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var abc =
          [
            c,
            xyz,
            {
              a: 1,
              b: 2
            }
          ];
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var abc = [
          c,
          xyz,
          {
            a: 1,
            b: 2
          }
        ];
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var abc = 5,
            c = 2,
            xyz =
            {
              a: 1,
              b: 2
            };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    $`
      var
          x = {
              a: 1,
          },
          y = {
              b: 2
          }
    `,
    $`
      const
          x = {
              a: 1,
          },
          y = {
              b: 2
          }
    `,
    $`
      let
          x = {
              a: 1,
          },
          y = {
              b: 2
          }
    `,
    $`
      var foo = { a: 1 }, bar = {
          b: 2
      };
    `,
    $`
      var foo = { a: 1 }, bar = {
              b: 2
          },
          baz = {
              c: 3
          }
    `,
    $`
      const {
              foo
          } = 1,
          bar = 2
    `,
    {
      code: $`
        var foo = 1,
          bar =
            2
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var foo = 1,
          bar
            = 2
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var foo
          = 1,
          bar
            = 2
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var foo
          =
          1,
          bar
            =
            2
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var foo
          = (1),
          bar
            = (2)
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        let foo = 'foo',
            bar = bar;
        const a = 'a',
              b = 'b';
      `,
      options: [2, { VariableDeclarator: 'first' }],
    },
    {
      code: $`
        let foo = 'foo',
            bar = bar  // <-- no semicolon here
        const a = 'a',
              b = 'b'  // <-- no semicolon here
      `,
      options: [2, { VariableDeclarator: 'first' }],
    },
    {
      code: $`
        var foo = 1,
            bar = 2,
            baz = 3
        ;
      `,
      options: [2, { VariableDeclarator: { var: 2 } }],
    },
    {
      code: $`
        var foo = 1,
            bar = 2,
            baz = 3
            ;
      `,
      options: [2, { VariableDeclarator: { var: 2 } }],
    },
    {
      code: $`
        var foo = 'foo',
            bar = bar;
      `,
      options: [2, { VariableDeclarator: { var: 'first' } }],
    },
    {
      code: $`
        var foo = 'foo',
            bar = 'bar'  // <-- no semicolon here
      `,
      options: [2, { VariableDeclarator: { var: 'first' } }],
    },
    {
      code: $`
        let foo = 1,
            bar = 2,
            baz
      `,
      options: [2, { VariableDeclarator: 'first' }],
    },
    {
      code: $`
        let
            foo
      `,
      options: [4, { VariableDeclarator: 'first' }],
    },
    {
      code: $`
        let foo = 1,
            bar =
            2
      `,
      options: [2, { VariableDeclarator: 'first' }],
    },
    {
      code: $`
        var abc =
            {
              a: 1,
              b: 2
            };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        var a = new abc({
                a: 1,
                b: 2
            }),
            b = 2;
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var a = 2,
          c = {
            a: 1,
            b: 2
          },
          b = 2;
      `,
      options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var x = 2,
            y = {
              a: 1,
              b: 2
            },
            b = 2;
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        var e = {
              a: 1,
              b: 2
            },
            b = 2;
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        var a = {
          a: 1,
          b: 2
        };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        function test() {
          if (true ||
                    false){
            console.log(val);
          }
        }
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    $`
      var foo = bar ||
          !(
              baz
          );
    `,
    $`
      for (var foo = 1;
          foo < 10;
          foo++) {}
    `,
    $`
      for (
          var foo = 1;
          foo < 10;
          foo++
      ) {}
    `,
    {
      code: $`
        for (var val in obj)
          if (true)
            console.log(val);
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        with (a)
            b();
      `,
      options: [4],
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        with (a)
            b();
        c();
      `,
      options: [4],
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        if(true)
          if (true)
            if (true)
              console.log(val);
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        function hi(){     var a = 1;
          y++;                   x++;
        }
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        for(;length > index; index++)if(NO_HOLES || index in self){
          x++;
        }
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        function test(){
          switch(length){
            case 1: return function(a){
              return fn.call(that, a);
            };
          }
        }
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        var geometry = 2,
        rotate = 2;
      `,
      options: [2, { VariableDeclarator: 0 }],
    },
    {
      code: $`
        var geometry,
            rotate;
      `,
      options: [4, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var geometry,
        \trotate;
      `,
      options: ['tab', { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var geometry,
          rotate;
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        var geometry,
            rotate;
      `,
      options: [2, { VariableDeclarator: 2 }],
    },
    {
      code: $`
        let geometry,
            rotate;
      `,
      options: [2, { VariableDeclarator: 2 }],
    },
    {
      code: $`
        const geometry = 2,
            rotate = 3;
      `,
      options: [2, { VariableDeclarator: 2 }],
    },
    {
      code: $`
        var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
          height, rotate;
      `,
      options: [2, { SwitchCase: 1 }],
    },
    {
      code: 'var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth;',
      options: [2, { SwitchCase: 1 }],
    },
    {
      code: $`
        if (1 < 2){
        //hi sd
        }
      `,
      options: [2],
    },
    {
      code: $`
        while (1 < 2){
          //hi sd
        }
      `,
      options: [2],
    },
    {
      code: 'while (1 < 2) console.log(\'hi\');',
      options: [2],
    },

    {
      code: $`
        [a, boop,
            c].forEach((index) => {
            index;
        });
      `,
      options: [4],
    },
    {
      code: $`
        [a, b,
            c].forEach(function(index){
            return index;
        });
      `,
      options: [4],
    },
    {
      code: $`
        [a, b, c].forEach((index) => {
            index;
        });
      `,
      options: [4],
    },
    {
      code: $`
        [a, b, c].forEach(function(index){
            return index;
        });
      `,
      options: [4],
    },
    {
      code: $`
        (foo)
            .bar([
                baz
            ]);
      `,
      options: [4, { MemberExpression: 1 }],
    },
    {
      code: $`
        switch (x) {
            case "foo":
                a();
                break;
            case "bar":
                switch (y) {
                    case "1":
                        break;
                    case "2":
                        a = 6;
                        break;
                }
            case "test":
                break;
        }
      `,
      options: [4, { SwitchCase: 1 }],
    },
    {
      code: $`
        switch (x) {
                case "foo":
                    a();
                    break;
                case "bar":
                    switch (y) {
                            case "1":
                                break;
                            case "2":
                                a = 6;
                                break;
                    }
                case "test":
                    break;
        }
      `,
      options: [4, { SwitchCase: 2 }],
    },
    $`
      switch (a) {
      case "foo":
          a();
          break;
      case "bar":
          switch(x){
          case '1':
              break;
          case '2':
              a = 6;
              break;
          }
      }
    `,
    $`
      switch (a) {
      case "foo":
          a();
          break;
      case "bar":
          if(x){
              a = 2;
          }
          else{
              a = 6;
          }
      }
    `,
    $`
      switch (a) {
      case "foo":
          a();
          break;
      case "bar":
          if(x){
              a = 2;
          }
          else
              a = 6;
      }
    `,
    $`
      switch (a) {
      case "foo":
          a();
          break;
      case "bar":
          a(); break;
      case "baz":
          a(); break;
      }
    `,
    $`
      switch (0) {
      }
    `,
    $`
      function foo() {
          var a = "a";
          switch(a) {
          case "a":
              return "A";
          case "b":
              return "B";
          }
      }
      foo();
    `,
    {
      code: $`
        switch(value){
            case "1":
            case "2":
                a();
                break;
            default:
                a();
                break;
        }
        switch(value){
            case "1":
                a();
                break;
            case "2":
                break;
            default:
                break;
        }
      `,
      options: [4, { SwitchCase: 1 }],
    },
    {
      code: $`
        var obj = {foo: 1, bar: 2};
        with (obj) {
            console.log(foo + bar);
        }
      `,
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        if (a) {
            (1 + 2 + 3); // no error on this line
        }
      `,
      parserOptions: { sourceType: 'script' },
    },
    'switch(value){ default: a(); break; }',
    {
      code: $`
        import {addons} from 'react/addons'
        import React from 'react'
      `,
      options: [2],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        import {
            foo,
            bar,
            baz
        } from 'qux';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        var foo = 0, bar = 0; baz = 0;
        export {
            foo,
            bar,
            baz
        } from 'qux';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        var a = 1,
            b = 2,
            c = 3;
      `,
      options: [4],
    },
    {
      code: $`
        var a = 1
            ,b = 2
            ,c = 3;
      `,
      options: [4],
    },
    {
      code: 'while (1 < 2) console.log(\'hi\')',
      options: [2],
    },
    {
      code: $`
        function salutation () {
          switch (1) {
            case 0: return console.log('hi')
            case 1: return console.log('hey')
          }
        }
      `,
      options: [2, { SwitchCase: 1 }],
    },
    {
      code: $`
        var items = [
          {
            foo: 'bar'
          }
        ];
      `,
      options: [2, { VariableDeclarator: 2 }],
    },
    {
      code: $`
        const a = 1,
              b = 2;
        const items1 = [
          {
            foo: 'bar'
          }
        ];
        const items2 = Items(
          {
            foo: 'bar'
          }
        );
      `,
      options: [2, { VariableDeclarator: 3 }],

    },
    {
      code: $`
        const geometry = 2,
              rotate = 3;
        var a = 1,
          b = 2;
        let light = true,
            shadow = false;
      `,
      options: [2, { VariableDeclarator: { const: 3, let: 2 } }],
    },
    {
      code: $`
        const abc = 5,
              c = 2,
              xyz =
              {
                a: 1,
                b: 2
              };
        let abc2 = 5,
          c2 = 2,
          xyz2 =
          {
            a: 1,
            b: 2
          };
        var abc3 = 5,
            c3 = 2,
            xyz3 =
            {
              a: 1,
              b: 2
            };
      `,
      options: [2, { VariableDeclarator: { var: 2, const: 3 }, SwitchCase: 1 }],
    },
    {
      code: $`
        module.exports = {
          'Unit tests':
          {
            rootPath: './',
            environment: 'node',
            tests:
            [
              'test/test-*.js'
            ],
            sources:
            [
              '*.js',
              'test/**.js'
            ]
          }
        };
      `,
      options: [2],
    },
    {
      code: $`
        foo =
          bar;
      `,
      options: [2],
    },
    {
      code: $`
        foo = (
          bar
        );
      `,
      options: [2],
    },
    {
      code: $`
        var path     = require('path')
          , crypto    = require('crypto')
          ;
      `,
      options: [2],
    },
    $`
      var a = 1
          ,b = 2
          ;
    `,
    {
      code: $`
        export function create (some,
                                argument) {
          return Object.create({
            a: some,
            b: argument
          });
        };
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' } }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        export function create (id, xfilter, rawType,
                                width=defaultWidth, height=defaultHeight,
                                footerHeight=defaultFooterHeight,
                                padding=defaultPadding) {
          // ... function body, indented two spaces
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' } }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        var obj = {
          foo: function () {
            return new p()
              .then(function (ok) {
                return ok;
              }, function () {
                // ignore things
              });
          }
        };
      `,
      options: [2],
    },
    {
      code: $`
        a.b()
          .c(function(){
            var a;
          }).d.e;
      `,
      options: [2],
    },
    {
      code: $`
        const YO = 'bah',
              TE = 'mah'
        
        var res,
            a = 5,
            b = 4
      `,
      options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
    },
    {
      code: $`
        const YO = 'bah',
              TE = 'mah'
        
        var res,
            a = 5,
            b = 4
        
        if (YO) console.log(TE)
      `,
      options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
    },
    {
      code: $`
        var foo = 'foo',
          bar = 'bar',
          baz = function() {
        
          }
        
        function hello () {
        
        }
      `,
      options: [2],
    },
    {
      code: $`
        var obj = {
          send: function () {
            return P.resolve({
              type: 'POST'
            })
              .then(function () {
                return true;
              }, function () {
                return false;
              });
          }
        };
      `,
      options: [2],
    },
    {
      code: $`
        var obj = {
          send: function () {
            return P.resolve({
              type: 'POST'
            })
            .then(function () {
              return true;
            }, function () {
              return false;
            });
          }
        };
      `,
      options: [2, { MemberExpression: 0 }],
    },
    $`
      const someOtherFunction = argument => {
              console.log(argument);
          },
          someOtherValue = 'someOtherValue';
    `,
    {
      code: $`
        [
          'a',
          'b'
        ].sort().should.deepEqual([
          'x',
          'y'
        ]);
      `,
      options: [2],
    },
    {
      code: $`
        var a = 1,
            B = class {
              constructor(){}
              a(){}
              get b(){}
            };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        var a = 1,
            B =
            class {
              constructor(){}
              a(){}
              get b(){}
            },
            c = 3;
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
    },
    {
      code: $`
        class A{
            constructor(){}
            a(){}
            get b(){}
        }
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var A = class {
            constructor(){}
            a(){}
            get b(){}
        }
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
    },
    {
      code: $`
        var a = {
          some: 1
          , name: 2
        };
      `,
      options: [2],
    },
    {
      code: $`
        a.c = {
            aa: function() {
                'test1';
                return 'aa';
            }
            , bb: function() {
                return this.bb();
            }
        };
      `,
      options: [4],
    },
    {
      code: $`
        var a =
        {
            actions:
            [
                {
                    name: 'compile'
                }
            ]
        };
      `,
      options: [4, { VariableDeclarator: 0, SwitchCase: 1 }],
    },
    {
      code: $`
        var a =
        [
            {
                name: 'compile'
            }
        ];
      `,
      options: [4, { VariableDeclarator: 0, SwitchCase: 1 }],
    },
    $`
      [[
      ], function(
          foo
      ) {}
      ]
    `,
    $`
      define([
          'foo'
      ], function(
          bar
      ) {
          baz;
      }
      )
    `,
    {
      code: $`
        const func = function (opts) {
            return Promise.resolve()
            .then(() => {
                [
                    'ONE', 'TWO'
                ].forEach(command => { doSomething(); });
            });
        };
      `,
      options: [4, { MemberExpression: 0 }],
    },
    {
      code: $`
        const func = function (opts) {
            return Promise.resolve()
                .then(() => {
                    [
                        'ONE', 'TWO'
                    ].forEach(command => { doSomething(); });
                });
        };
      `,
      options: [4],
    },
    {
      code: $`
        var haveFun = function () {
            SillyFunction(
                {
                    value: true,
                },
                {
                    _id: true,
                }
            );
        };
      `,
      options: [4],
    },
    {
      code: $`
        var haveFun = function () {
            new SillyFunction(
                {
                    value: true,
                },
                {
                    _id: true,
                }
            );
        };
      `,
      options: [4],
    },
    {
      code: $`
        let object1 = {
          doThing() {
            return _.chain([])
              .map(v => (
                {
                  value: true,
                }
              ))
              .value();
          }
        };
      `,
      options: [2],
    },
    {
      code: $`
        var foo = {
            bar: 1,
            baz: {
              qux: 2
            }
          },
          bar = 1;
      `,
      options: [2],
    },
    {
      code: $`
        class Foo
          extends Bar {
          baz() {}
        }
      `,
      options: [2],
    },
    {
      code: $`
        class Foo extends
          Bar {
          baz() {}
        }
      `,
      options: [2],
    },
    {
      code: $`
        class Foo extends
          (
            Bar
          ) {
          baz() {}
        }
      `,
      options: [2],
    },
    {
      code: $`
        fs.readdirSync(path.join(__dirname, '../rules')).forEach(name => {
          files[name] = foo;
        });
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        (function(){
        function foo(x) {
          return x + 1;
        }
        })();
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        (function(){
                function foo(x) {
                    return x + 1;
                }
        })();
      `,
      options: [4, { outerIIFEBody: 2 }],
    },
    {
      code: $`
        (function(x, y){
        function foo(x) {
          return x + 1;
        }
        })(1, 2);
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        (function(){
        function foo(x) {
          return x + 1;
        }
        }());
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        !function(){
        function foo(x) {
          return x + 1;
        }
        }();
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        !function(){
        \t\t\tfunction foo(x) {
        \t\t\t\treturn x + 1;
        \t\t\t}
        }();
      `,
      options: ['tab', { outerIIFEBody: 3 }],
    },
    {
      code: $`
        var out = function(){
          function fooVar(x) {
            return x + 1;
          }
        };
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        var ns = function(){
        function fooVar(x) {
          return x + 1;
        }
        }();
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        ns = function(){
        function fooVar(x) {
          return x + 1;
        }
        }();
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        var ns = (function(){
        function fooVar(x) {
          return x + 1;
        }
        }(x));
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        var ns = (function(){
                function fooVar(x) {
                    return x + 1;
                }
        }(x));
      `,
      options: [4, { outerIIFEBody: 2 }],
    },
    {
      code: $`
        var obj = {
          foo: function() {
            return true;
          }
        };
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        while (
          function() {
            return true;
          }()) {
        
          x = x + 1;
        };
      `,
      options: [2, { outerIIFEBody: 20 }],
    },
    {
      code: $`
        (() => {
        function foo(x) {
          return x + 1;
        }
        })();
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        function foo() {
        }
      `,
      options: ['tab', { outerIIFEBody: 0 }],
    },
    {
      code: $`
        ;(() => {
        function foo(x) {
          return x + 1;
        }
        })();
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        if(data) {
          console.log('hi');
        }
      `,
      options: [2, { outerIIFEBody: 0 }],
    },
    {
      code: $`
        (function(x) {
            return x + 1;
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
    },
    {
      code: $`
        (function(x) {
        return x + 1;
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
    },
    {
      code: $`
        ;(() => {
            function x(y) {
                return y + 1;
            }
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
    },
    {
      code: $`
        ;(() => {
        function x(y) {
            return y + 1;
        }
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
    },
    {
      code: $`
        function foo() {
        }
      `,
      options: [4, { outerIIFEBody: 'off' }],
    },
    {
      code: 'Buffer.length',
      options: [4, { MemberExpression: 1 }],
    },
    {
      code: $`
        Buffer
            .indexOf('a')
            .toString()
      `,
      options: [4, { MemberExpression: 1 }],
    },
    {
      code: $`
        Buffer.
            length
      `,
      options: [4, { MemberExpression: 1 }],
    },
    {
      code: $`
        Buffer
            .foo
            .bar
      `,
      options: [4, { MemberExpression: 1 }],
    },
    {
      code: $`
        Buffer
        \t.foo
        \t.bar
      `,
      options: ['tab', { MemberExpression: 1 }],
    },
    {
      code: $`
        Buffer
            .foo
            .bar
      `,
      options: [2, { MemberExpression: 2 }],
    },
    $`
      (
          foo
              .bar
      )
    `,
    $`
      (
          (
              foo
                  .bar
          )
      )
    `,
    $`
      (
          foo
      )
          .bar
    `,
    $`
      (
          (
              foo
          )
              .bar
      )
    `,
    $`
      (
          (
              foo
          )
              [
                  (
                      bar
                  )
              ]
      )
    `,
    $`
      (
          foo[bar]
      )
          .baz
    `,
    $`
      (
          (foo.bar)
      )
          .baz
    `,
    {
      code: $`
        MemberExpression
        .can
          .be
            .turned
         .off();
      `,
      options: [4, { MemberExpression: 'off' }],
    },
    {
      code: $`
        foo = bar.baz()
            .bip();
      `,
      options: [4, { MemberExpression: 1 }],
    },
    $`
      function foo() {
          new
              .target
      }
    `,
    $`
      function foo() {
          new.
              target
      }
    `,
    {
      code: $`
        if (foo) {
          bar();
        } else if (baz) {
          foobar();
        } else if (qux) {
          qux();
        }
      `,
      options: [2],
    },
    {
      code: $`
        function foo(aaa,
          bbb, ccc, ddd) {
            bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 1, body: 2 } }],
    },
    {
      code: $`
        function foo(aaa, bbb,
              ccc, ddd) {
          bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 3, body: 1 } }],
    },
    {
      code: $`
        function foo(aaa,
            bbb,
            ccc) {
                    bar();
        }
      `,
      options: [4, { FunctionDeclaration: { parameters: 1, body: 3 } }],
    },
    {
      code: $`
        function foo(aaa,
                     bbb, ccc,
                     ddd, eee, fff) {
          bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first', body: 1 } }],
    },
    {
      code: $`
        function foo(aaa, bbb)
        {
              bar();
        }
      `,
      options: [2, { FunctionDeclaration: { body: 3 } }],
    },
    {
      code: $`
        function foo(
          aaa,
          bbb) {
            bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first', body: 2 } }],
    },
    {
      code: $`
        var foo = function(aaa,
            bbb,
            ccc,
            ddd) {
        bar();
        }
      `,
      options: [2, { FunctionExpression: { parameters: 2, body: 0 } }],
    },
    {
      code: $`
        var foo = function(aaa,
          bbb,
          ccc) {
                            bar();
        }
      `,
      options: [2, { FunctionExpression: { parameters: 1, body: 10 } }],
    },
    {
      code: $`
        var foo = function(aaa,
                           bbb, ccc, ddd,
                           eee, fff) {
            bar();
        }
      `,
      options: [4, { FunctionExpression: { parameters: 'first', body: 1 } }],
    },
    {
      code: $`
        var foo = function(
          aaa, bbb, ccc,
          ddd, eee) {
              bar();
        }
      `,
      options: [2, { FunctionExpression: { parameters: 'first', body: 3 } }],
    },
    {
      code: $`
        foo.bar(
              baz, qux, function() {
                    qux;
              }
        );
      `,
      options: [2, { FunctionExpression: { body: 3 }, CallExpression: { arguments: 3 } }],
    },
    {
      code: $`
        function foo() {
          function bar() {
            baz();
          }
        }
      `,
      options: [2, { FunctionDeclaration: { body: 1 } }],
    },
    {
      code: $`
        function foo() {
          function bar(baz,
              qux) {
            foobar();
          }
        }
      `,
      options: [2, { FunctionDeclaration: { body: 1, parameters: 2 } }],
    },
    {
      code: $`
        ((
            foo
        ))
      `,
      options: [4],
    },

    // ternary expressions (https://github.com/eslint/eslint/issues/7420)
    {
      code: $`
        foo
          ? bar
          : baz
      `,
      options: [2],
    },
    {
      code: $`
        foo = (bar ?
          baz :
          qux
        );
      `,
      options: [2],
    },
    {
      code: $`
        condition
          ? () => {
            return true
          }
          : condition2
            ? () => {
              return true
            }
            : () => {
              return false
            }
      `,
      options: [2],
    },
    {
      code: $`
        condition
          ? () => {
            return true
          }
          : condition2
            ? () => {
              return true
            }
            : () => {
              return false
            }
      `,
      options: [2, { offsetTernaryExpressions: false }],
    },
    {
      code: $`
        condition
          ? () => {
              return true
            }
          : condition2
            ? () => {
                return true
              }
            : () => {
                return false
              }
      `,
      options: [2, { offsetTernaryExpressions: true }],
    },
    {
      code: $`
        condition
            ? () => {
                    return true
                }
            : condition2
                ? () => {
                        return true
                    }
                : () => {
                        return false
                    }
      `,
      options: [4, { offsetTernaryExpressions: true }],
    },
    {
      code: $`
        condition1
          ? condition2
            ? Promise.resolve(1)
            : Promise.resolve(2)
          : Promise.resolve(3)
      `,
      options: [2, { offsetTernaryExpressions: true }],
    },
    {
      code: $`
        condition1
          ? Promise.resolve(1)
          : condition2
            ? Promise.resolve(2)
            : Promise.resolve(3)
      `,
      options: [2, { offsetTernaryExpressions: true }],
    },
    {
      code: $`
        condition
        \t? () => {
        \t\t\treturn true
        \t\t}
        \t: condition2
        \t\t? () => {
        \t\t\t\treturn true
        \t\t\t}
        \t\t: () => {
        \t\t\t\treturn false
        \t\t\t}
      `,
      options: ['tab', { offsetTernaryExpressions: true }],
    },
    $`
      [
          foo ?
              bar :
              baz,
          qux
      ];
    `,
    {

      /**
       *             Checking comments:
       * https://github.com/eslint/eslint/issues/3845, https://github.com/eslint/eslint/issues/6571
       */
      code: $`
        foo();
        // Line
        /* multiline
          Line */
        bar();
        // trailing comment
      `,
      options: [2],
    },
    {
      code: $`
        switch (foo) {
          case bar:
            baz();
            // call the baz function
        }
      `,
      options: [2, { SwitchCase: 1 }],
    },
    {
      code: $`
        switch (foo) {
          case bar:
            baz();
          // no default
        }
      `,
      options: [2, { SwitchCase: 1 }],
    },
    $`
      [
          // no elements
      ]
    `,
    {

      /**
       *             Destructuring assignments:
       * https://github.com/eslint/eslint/issues/6813
       */
      code: $`
        var {
          foo,
          bar,
          baz: qux,
          foobar: baz = foobar
        } = qux;
      `,
      options: [2],
    },
    {
      code: $`
        var [
          foo,
          bar,
          baz,
          foobar = baz
        ] = qux;
      `,
      options: [2],
    },
    {
      code: $`
        const {
          a
        }
        =
        {
          a: 1
        }
      `,
      options: [2],
    },
    {
      code: $`
        const {
          a
        } = {
          a: 1
        }
      `,
      options: [2],
    },
    {
      code: $`
        const
          {
            a
          } = {
            a: 1
          };
      `,
      options: [2],
    },
    {
      code: $`
        const
          foo = {
            bar: 1
          }
      `,
      options: [2],
    },
    {
      code: $`
        const [
          a
        ] = [
          1
        ]
      `,
      options: [2],
    },
    {

      // https://github.com/eslint/eslint/issues/7233
      code: $`
        var folder = filePath
            .foo()
            .bar;
      `,
      options: [2, { MemberExpression: 2 }],
    },
    {
      code: $`
        for (const foo of bar)
          baz();
      `,
      options: [2],
    },
    {
      code: $`
        var x = () =>
          5;
      `,
      options: [2],
    },
    $`
      (
          foo
      )(
          bar
      )
    `,
    $`
      (() =>
          foo
      )(
          bar
      )
    `,
    $`
      (() => {
          foo();
      })(
          bar
      )
    `,
    {

      // Don't lint the indentation of the first token after a :
      code: $`
        ({code:
          "foo.bar();"})
      `,
      options: [2],
    },
    {

      // Don't lint the indentation of the first token after a :
      code: $`
        ({code:
        "foo.bar();"})
      `,
      options: [2],
    },
    $`
      ({
          foo:
              bar
      })
    `,
    $`
      ({
          [foo]:
              bar
      })
    `,
    {

      // Comments in switch cases
      code: $`
        switch (foo) {
          // comment
          case study:
            // comment
            bar();
          case closed:
            /* multiline comment
            */
        }
      `,
      options: [2, { SwitchCase: 1 }],
    },
    {

      // Comments in switch cases
      code: $`
        switch (foo) {
          // comment
          case study:
          // the comment can also be here
          case closed:
        }
      `,
      options: [2, { SwitchCase: 1 }],
    },
    {

      // BinaryExpressions with parens
      code: $`
        foo && (
            bar
        )
      `,
      options: [4],
    },
    {

      // BinaryExpressions with parens
      code: $`
        foo && ((
            bar
        ))
      `,
      options: [4],
    },
    {
      code: $`
        foo &&
            (
                bar
            )
      `,
      options: [4],
    },
    $`
      foo &&
          !bar(
          )
    `,
    $`
      foo &&
          ![].map(() => {
              bar();
          })
    `,
    {
      code: $`
        foo =
            bar;
      `,
      options: [4],
    },
    {
      code: $`
        function foo() {
          var bar = function(baz,
                qux) {
            foobar();
          };
        }
      `,
      options: [2, { FunctionExpression: { parameters: 3 } }],
    },
    $`
      function foo() {
          return (bar === 1 || bar === 2 &&
              (/Function/.test(grandparent.type))) &&
              directives(parent).indexOf(node) >= 0;
      }
    `,
    {
      code: $`
        function foo() {
            return (foo === bar || (
                baz === qux && (
                    foo === foo ||
                    bar === bar ||
                    baz === baz
                )
            ))
        }
      `,
      options: [4],
    },
    $`
      if (
          foo === 1 ||
          bar === 1 ||
          // comment
          (baz === 1 && qux === 1)
      ) {}
    `,
    {
      code: $`
        foo =
          (bar + baz);
      `,
      options: [2],
    },
    {
      code: $`
        function foo() {
          return (bar === 1 || bar === 2) &&
            (z === 3 || z === 4);
        }
      `,
      options: [2],
    },
    {
      code: $`
        /* comment */ if (foo) {
          bar();
        }
      `,
      options: [2],
    },
    {

      // Comments at the end of if blocks that have `else` blocks can either refer to the lines above or below them
      code: $`
        if (foo) {
          bar();
        // Otherwise, if foo is false, do baz.
        // baz is very important.
        } else {
          baz();
        }
      `,
      options: [2],
    },
    {
      code: $`
        function foo() {
          return ((bar === 1 || bar === 2) &&
            (z === 3 || z === 4));
        }
      `,
      options: [2],
    },
    {
      code: $`
        foo(
          bar,
          baz,
          qux
        );
      `,
      options: [2, { CallExpression: { arguments: 1 } }],
    },
    {
      code: $`
        foo(
        \tbar,
        \tbaz,
        \tqux
        );
      `,
      options: ['tab', { CallExpression: { arguments: 1 } }],
    },
    {
      code: $`
        foo(bar,
                baz,
                qux);
      `,
      options: [4, { CallExpression: { arguments: 2 } }],
    },
    {
      code: $`
        foo(
        bar,
        baz,
        qux
        );
      `,
      options: [2, { CallExpression: { arguments: 0 } }],
    },
    {
      code: $`
        foo(bar,
            baz,
            qux
        );
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
    },
    {
      code: $`
        foo(bar, baz,
            qux, barbaz,
            barqux, bazqux);
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
    },
    {
      code: $`
        foo(bar,
                1 + 2,
                !baz,
                new Car('!')
        );
      `,
      options: [2, { CallExpression: { arguments: 4 } }],
    },
    $`
      foo(
          (bar)
      );
    `,
    {
      code: $`
        foo(
            (bar)
        );
      `,
      options: [4, { CallExpression: { arguments: 1 } }],
    },

    // https://github.com/eslint/eslint/issues/7484
    {
      code: $`
        var foo = function() {
          return bar(
            [{
            }].concat(baz)
          );
        };
      `,
      options: [2],
    },

    // https://github.com/eslint/eslint/issues/7573
    {
      code: $`
        return (
            foo
        );
      `,
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },
    {
      code: $`
        return (
            foo
        )
      `,
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },
    $`
      var foo = [
          bar,
          baz
      ]
    `,
    $`
      var foo = [bar,
          baz,
          qux
      ]
    `,
    {
      code: $`
        var foo = [bar,
        baz,
        qux
        ]
      `,
      options: [2, { ArrayExpression: 0 }],
    },
    {
      code: $`
        var foo = [bar,
                        baz,
                        qux
        ]
      `,
      options: [2, { ArrayExpression: 8 }],
    },
    {
      code: $`
        var foo = [bar,
                   baz,
                   qux
        ]
      `,
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: $`
        var foo = [bar,
                   baz, qux
        ]
      `,
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: $`
        var foo = [
                { bar: 1,
                  baz: 2 },
                { bar: 3,
                  baz: 4 }
        ]
      `,
      options: [4, { ArrayExpression: 2, ObjectExpression: 'first' }],
    },
    {
      code: $`
        var foo = {
        bar: 1,
        baz: 2
        };
      `,
      options: [2, { ObjectExpression: 0 }],
    },
    {
      code: $`
        var foo = { foo: 1, bar: 2,
                    baz: 3 }
      `,
      options: [2, { ObjectExpression: 'first' }],
    },
    {
      code: $`
        var foo = [
                {
                    foo: 1
                }
        ]
      `,
      options: [4, { ArrayExpression: 2 }],
    },
    {
      code: $`
        function foo() {
          [
                  foo
          ]
        }
      `,
      options: [2, { ArrayExpression: 4 }],
    },
    {
      code: '[\n]',
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: '[\n]',
      options: [2, { ArrayExpression: 1 }],
    },
    {
      code: '{\n}',
      options: [2, { ObjectExpression: 'first' }],
    },
    {
      code: '{\n}',
      options: [2, { ObjectExpression: 1 }],
    },
    {
      code: $`
        var foo = [
          [
            1
          ]
        ]
      `,
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: $`
        var foo = [ 1,
                    [
                      2
                    ]
        ];
      `,
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: $`
        var foo = bar(1,
                      [ 2,
                        3
                      ]
        );
      `,
      options: [4, { ArrayExpression: 'first', CallExpression: { arguments: 'first' } }],
    },
    {
      code: $`
        var foo =
            [
            ]()
      `,
      options: [4, { CallExpression: { arguments: 'first' }, ArrayExpression: 'first' }],
    },

    // https://github.com/eslint/eslint/issues/7732
    {
      code: $`
        const lambda = foo => {
          Object.assign({},
            filterName,
            {
              display
            }
          );
        }
      `,
      options: [2, { ObjectExpression: 1 }],
    },
    {
      code: $`
        const lambda = foo => {
          Object.assign({},
            filterName,
            {
              display
            }
          );
        }
      `,
      options: [2, { ObjectExpression: 'first' }],
    },

    // https://github.com/eslint/eslint/issues/7733
    {
      code: $`
        var foo = function() {
        \twindow.foo('foo',
        \t\t{
        \t\t\tfoo: 'bar',
        \t\t\tbar: {
        \t\t\t\tfoo: 'bar'
        \t\t\t}
        \t\t}
        \t);
        }
      `,
      options: ['tab'],
    },
    {
      code: $`
        echo = spawn('cmd.exe',
                     ['foo', 'bar',
                      'baz']);
      `,
      options: [2, { ArrayExpression: 'first', CallExpression: { arguments: 'first' } }],
    },
    {
      code: $`
        if (foo)
          bar();
        // Otherwise, if foo is false, do baz.
        // baz is very important.
        else {
          baz();
        }
      `,
      options: [2],
    },
    {
      code: $`
        if (
            foo && bar ||
            baz && qux // This line is ignored because BinaryExpressions are not checked.
        ) {
            qux();
        }
      `,
      options: [4],
    },
    $`
      [
      ] || [
      ]
    `,
    $`
      (
          [
          ] || [
          ]
      )
    `,
    $`
      1
      + (
          1
      )
    `,
    $`
      (
          foo && (
              bar ||
              baz
          )
      )
    `,
    $`
      foo
          || (
              bar
          )
    `,
    $`
      foo
                      || (
                          bar
                      )
    `,
    {
      code: $`
        var foo =
                1;
      `,
      options: [4, { VariableDeclarator: 2 }],
    },
    {
      code: $`
        var foo = 1,
            bar =
            2;
      `,
      options: [4],
    },
    {
      code: $`
        switch (foo) {
          case bar:
          {
            baz();
          }
        }
      `,
      options: [2, { SwitchCase: 1 }],
    },

    // Template curlies
    {
      code: $`
        \`foo\${
          bar}\`
      `,
      options: [2],
    },
    {
      code: $`
        \`foo\${
          \`bar\${
            baz}\`}\`
      `,
      options: [2],
    },
    {
      code: $`
        \`foo\${
          \`bar\${
            baz
          }\`
        }\`
      `,
      options: [2],
    },
    {
      code: $`
        \`foo\${
          (
            bar
          )
        }\`
      `,
      options: [2],
    },
    $`
      foo(\`
          bar
      \`, {
          baz: 1
      });
    `,
    $`
      function foo() {
          \`foo\${bar}baz\${
              qux}foo\${
              bar}baz\`
      }
    `,
    $`
      JSON
          .stringify(
              {
                  ok: true
              }
          );
    `,

    // Don't check AssignmentExpression assignments
    $`
      foo =
          bar =
          baz;
    `,
    $`
      foo =
      bar =
          baz;
    `,
    $`
      function foo() {
          const template = \`this indentation is not checked
      because it's part of a template literal.\`;
      }
    `,
    $`
      function foo() {
          const template = \`the indentation of a \${
              node.type
          } node is checked.\`;
      }
    `,
    {

      // https://github.com/eslint/eslint/issues/7320
      code: $`
        JSON
            .stringify(
                {
                    test: 'test'
                }
            );
      `,
      options: [4, { CallExpression: { arguments: 1 } }],
    },
    $`
      [
          foo,
          // comment
          // another comment
          bar
      ]
    `,
    $`
      if (foo) {
          /* comment */ bar();
      }
    `,
    $`
      function foo() {
          return (
              1
          );
      }
    `,
    $`
      function foo() {
          return (
              1
          )
      }
    `,
    $`
      if (
          foo &&
          !(
              bar
          )
      ) {}
    `,
    {

      // https://github.com/eslint/eslint/issues/6007
      code: $`
        var abc = [
          (
            ''
          ),
          def,
        ]
      `,
      options: [2],
    },
    {
      code: $`
        var abc = [
          (
            ''
          ),
          (
            'bar'
          )
        ]
      `,
      options: [2],
    },
    $`
      function f() {
          return asyncCall()
              .then(
                  'some string',
                  [
                      1,
                      2,
                      3
                  ]
              );
      }
    `,
    {

      // https://github.com/eslint/eslint/issues/6670
      code: $`
        function f() {
            return asyncCall()
                .then(
                    'some string',
                    [
                        1,
                        2,
                        3
                    ]
                );
        }
      `,
      options: [4, { MemberExpression: 1 }],
    },

    // https://github.com/eslint/eslint/issues/7242
    $`
      var x = [
          [1],
          [2]
      ]
    `,
    $`
      var y = [
          {a: 1},
          {b: 2}
      ]
    `,
    $`
      foo(
      )
    `,
    {

      // https://github.com/eslint/eslint/issues/7616
      code: $`
        foo(
            bar,
            {
                baz: 1
            }
        )
      `,
      options: [4, { CallExpression: { arguments: 'first' } }],
    },
    'new Foo',
    'new (Foo)',
    $`
      if (Foo) {
          new Foo
      }
    `,
    {
      code: $`
        var foo = 0, bar = 0, baz = 0;
        export {
            foo,
            bar,
            baz
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        foo
            ? bar
            : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo ?
            bar :
            baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo ?
            bar
            : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo
            ? bar :
            baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo
            ? bar
            : baz
                ? qux
                : foobar
                    ? boop
                    : beep
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo ?
            bar :
            baz ?
                qux :
                foobar ?
                    boop :
                    beep
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        var a =
            foo ? bar :
            baz ? qux :
            foobar ? boop :
            /*else*/ beep
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        var a = foo
            ? bar
            : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        var a =
            foo
                ? bar
                : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        a =
            foo ? bar :
            baz ? qux :
            foobar ? boop :
            /*else*/ beep
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        a = foo
            ? bar
            : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        a =
            foo
                ? bar
                : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo(
            foo ? bar :
            baz ? qux :
            foobar ? boop :
            /*else*/ beep
        )
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        function wrap() {
            return (
                foo ? bar :
                baz ? qux :
                foobar ? boop :
                /*else*/ beep
            )
        }
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        function wrap() {
            return foo
                ? bar
                : baz
        }
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        function wrap() {
            return (
                foo
                    ? bar
                    : baz
            )
        }
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo(
            foo
                ? bar
                : baz
        )
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo(foo
            ? bar
            : baz
        )
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo
            ? bar
            : baz
                ? qux
                : foobar
                    ? boop
                    : beep
      `,
      options: [4, { flatTernaryExpressions: false }],
    },
    {
      code: $`
        foo ?
            bar :
            baz ?
                qux :
                foobar ?
                    boop :
                    beep
      `,
      options: [4, { flatTernaryExpressions: false }],
    },
    {
      code: '[,]',
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: '[,]',
      options: [2, { ArrayExpression: 'off' }],
    },
    {
      code: $`
        [
            ,
            foo
        ]
      `,
      options: [4, { ArrayExpression: 'first' }],
    },
    {
      code: '[sparse, , array];',
      options: [2, { ArrayExpression: 'first' }],
    },
    {
      code: $`
        foo.bar('baz', function(err) {
          qux;
        });
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
    },
    {
      code: $`
        foo.bar(function() {
          cookies;
        }).baz(function() {
          cookies;
        });
      `,
      options: [2, { MemberExpression: 1 }],
    },
    {
      code: $`
        foo.bar().baz(function() {
          cookies;
        }).qux(function() {
          cookies;
        });
      `,
      options: [2, { MemberExpression: 1 }],
    },
    {
      code: $`
        (
          {
            foo: 1,
            baz: 2
          }
        );
      `,
      options: [2, { ObjectExpression: 'first' }],
    },
    {
      code: $`
        foo(() => {
            bar;
        }, () => {
            baz;
        })
      `,
      options: [4, { CallExpression: { arguments: 'first' } }],
    },
    {
      code: $`
        [ foo,
          bar ].forEach(function() {
          baz;
        })
      `,
      options: [2, { ArrayExpression: 'first', MemberExpression: 1 }],
    },
    $`
      foo = bar[
          baz
      ];
    `,
    {
      code: $`
        foo[
            bar
        ];
      `,
      options: [4, { MemberExpression: 1 }],
    },
    {
      code: $`
        foo[
            (
                bar
            )
        ];
      `,
      options: [4, { MemberExpression: 1 }],
    },
    $`
      if (foo)
          bar;
      else if (baz)
          qux;
    `,
    $`
      if (foo) bar()
      
      ; [1, 2, 3].map(baz)
    `,
    $`
      if (foo)
          ;
    `,
    'x => {}',
    {
      code: $`
        import {foo}
            from 'bar';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import \'foo\'',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        import { foo,
            bar,
            baz,
        } from 'qux';
      `,
      options: [4, { ImportDeclaration: 1 }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        import {
            foo,
            bar,
            baz,
        } from 'qux';
      `,
      options: [4, { ImportDeclaration: 1 }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        import { apple as a,
                 banana as b } from 'fruits';
        import { cat } from 'animals';
      `,
      options: [4, { ImportDeclaration: 'first' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        import { declaration,
                         can,
                          be,
                      turned } from 'off';
      `,
      options: [4, { ImportDeclaration: 'off' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },

    // https://github.com/eslint/eslint/issues/8455
    $`
      (
          a
      ) => b => {
          c
      }
    `,
    $`
      (
          a
      ) => b => c => d => {
          e
      }
    `,
    $`
      (
          a
      ) =>
          (
              b
          ) => {
              c
          }
    `,
    $`
      if (
          foo
      ) bar(
          baz
      );
    `,
    $`
      if (foo)
      {
          bar();
      }
    `,
    $`
      function foo(bar)
      {
          baz();
      }
    `,
    $`
      () =>
          ({})
    `,
    $`
      () =>
          (({}))
    `,
    $`
      (
          () =>
              ({})
      )
    `,
    $`
      var x = function foop(bar)
      {
          baz();
      }
    `,
    $`
      var x = (bar) =>
      {
          baz();
      }
    `,
    $`
      class Foo
      {
          constructor()
          {
              foo();
          }
      
          bar()
          {
              baz();
          }
      }
    `,
    $`
      class Foo
          extends Bar
      {
          constructor()
          {
              foo();
          }
      
          bar()
          {
              baz();
          }
      }
    `,
    $`
      (
          class Foo
          {
              constructor()
              {
                  foo();
              }
      
              bar()
              {
                  baz();
              }
          }
      )
    `,
    {
      code: $`
        switch (foo)
        {
            case 1:
                bar();
        }
      `,
      options: [4, { SwitchCase: 1 }],
    },
    $`
      foo
          .bar(function() {
              baz
          })
    `,
    {
      code: $`
        foo
                .bar(function() {
                    baz
                })
      `,
      options: [4, { MemberExpression: 2 }],
    },
    $`
      foo
          [bar](function() {
              baz
          })
    `,
    $`
      foo.
          bar.
          baz
    `,
    {
      code: $`
        foo
            .bar(function() {
                baz
            })
      `,
      options: [4, { MemberExpression: 'off' }],
    },
    {
      code: $`
        foo
                        .bar(function() {
                            baz
                        })
      `,
      options: [4, { MemberExpression: 'off' }],
    },
    {
      code: $`
        foo
                        [bar](function() {
                            baz
                        })
      `,
      options: [4, { MemberExpression: 'off' }],
    },
    {
      code: $`
        foo.
                bar.
                            baz
      `,
      options: [4, { MemberExpression: 'off' }],
    },
    {
      code: $`
        foo = bar(
        ).baz(
        )
      `,
      options: [4, { MemberExpression: 'off' }],
    },
    {
      code: $`
        foo[
            bar ? baz :
            qux
        ]
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        function foo() {
            return foo ? bar :
                baz
        }
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        throw foo ? bar :
            baz
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    {
      code: $`
        foo(
            bar
        ) ? baz :
            qux
      `,
      options: [4, { flatTernaryExpressions: true }],
    },
    $`
      foo
          [
              bar
          ]
          .baz(function() {
              quz();
          })
    `,
    $`
      [
          foo
      ][
          "map"](function() {
          qux();
      })
    `,
    $`
      (
          a.b(function() {
              c;
          })
      )
    `,
    $`
      (
          foo
      ).bar(function() {
          baz();
      })
    `,
    $`
      new Foo(
          bar
              .baz
              .qux
      )
    `,
    $`
      const foo = a.b(),
          longName =
              (baz(
                  'bar',
                  'bar'
              ));
    `,
    $`
      const foo = a.b(),
          longName =
          (baz(
              'bar',
              'bar'
          ));
    `,
    $`
      const foo = a.b(),
          longName =
              baz(
                  'bar',
                  'bar'
              );
    `,
    $`
      const foo = a.b(),
          longName =
          baz(
              'bar',
              'bar'
          );
    `,
    $`
      const foo = a.b(),
          longName
              = baz(
                  'bar',
                  'bar'
              );
    `,
    $`
      const foo = a.b(),
          longName
          = baz(
              'bar',
              'bar'
          );
    `,
    $`
      const foo = a.b(),
          longName =
              ('fff');
    `,
    $`
      const foo = a.b(),
          longName =
          ('fff');
    `,
    $`
      const foo = a.b(),
          longName
              = ('fff');
    `,
    $`
      const foo = a.b(),
          longName
          = ('fff');
    `,
    $`
      const foo = a.b(),
          longName =
              (
                  'fff'
              );
    `,
    $`
      const foo = a.b(),
          longName =
          (
              'fff'
          );
    `,
    $`
      const foo = a.b(),
          longName
              =(
                  'fff'
              );
    `,
    $`
      const foo = a.b(),
          longName
          =(
              'fff'
          );
    `,

    // ----------------------------------------------------------------------
    // Ignore Unknown Nodes
    // ----------------------------------------------------------------------

    {
      code: $`
        interface Foo {
            bar: string;
            baz: number;
        }
      `,
      parser: tsParser,
    },
    {
      code: $`
        namespace Foo {
            const bar = 3,
                baz = 2;
        
            if (true) {
                const bax = 3;
            }
        }
      `,
      parser: tsParser,
    },
    {
      code: $`
        abstract class Foo {
            public bar() {
                let aaa = 4,
                    boo;
        
                if (true) {
                    boo = 3;
                }
        
                boo = 3 + 2;
            }
        }
      `,
      parser: tsParser,
    },
    {
      code: $`
        function foo() {
            function bar() {
                abstract class X {
                    public baz() {
                        if (true) {
                            qux();
                        }
                    }
                }
            }
        }
      `,
      parser: tsParser,
    },
    {
      code: $`
        namespace Unknown {
            function foo() {
                function bar() {
                    abstract class X {
                        public baz() {
                            if (true) {
                                qux();
                            }
                        }
                    }
                }
            }
        }
      `,
      parser: tsParser,
    },
    {
      code: $`
        type httpMethod = 'GET'
          | 'POST'
          | 'PUT';
      `,
      options: [2, { VariableDeclarator: 0 }],
      parser: tsParser,
    },
    {
      code: $`
        type httpMethod = 'GET'
        | 'POST'
        | 'PUT';
      `,
      options: [2, { VariableDeclarator: 1 }],
      parser: tsParser,
    },
    $`
      foo(\`foo
              \`, {
          ok: true
      },
      {
          ok: false
      })
    `,
    $`
      foo(tag\`foo
              \`, {
          ok: true
      },
      {
          ok: false
      }
      )
    `,

    // https://github.com/eslint/eslint/issues/8815
    $`
      async function test() {
          const {
              foo,
              bar,
          } = await doSomethingAsync(
              1,
              2,
              3,
          );
      }
    `,
    $`
      function* test() {
          const {
              foo,
              bar,
          } = yield doSomethingAsync(
              1,
              2,
              3,
          );
      }
    `,
    $`
      ({
          a: b
      } = +foo(
          bar
      ));
    `,
    $`
      const {
          foo,
          bar,
      } = typeof foo(
          1,
          2,
          3,
      );
    `,
    $`
      const {
          foo,
          bar,
      } = +(
          foo
      );
    `,

    // ----------------------------------------------------------------------
    // JSX tests
    // https://github.com/eslint/eslint/issues/8425
    // Some of the following tests are adapted from the tests in eslint-plugin-react.
    // License: https://github.com/yannickcr/eslint-plugin-react/blob/7ca9841f22d599f447a27ef5b2a97def9229d6c8/LICENSE
    // ----------------------------------------------------------------------

    '<Foo a="b" c="d"/>;',
    $`
      <Foo
          a="b"
          c="d"
      />;
    `,
    'var foo = <Bar a="b" c="d"/>;',
    $`
      var foo = <Bar
          a="b"
          c="d"
      />;
    `,
    $`
      var foo = (<Bar
          a="b"
          c="d"
      />);
    `,
    $`
      var foo = (
          <Bar
              a="b"
              c="d"
          />
      );
    `,
    $`
      <
          Foo
          a="b"
          c="d"
      />;
    `,
    $`
      <Foo
          a="b"
          c="d"/>;
    `,
    $`
      <
          Foo
          a="b"
          c="d"/>;
    `,
    '<a href="foo">bar</a>;',
    $`
      <a href="foo">
          bar
      </a>;
    `,
    $`
      <a
          href="foo"
      >
          bar
      </a>;
    `,
    $`
      <a
          href="foo">
          bar
      </a>;
    `,
    $`
      <
          a
          href="foo">
          bar
      </a>;
    `,
    $`
      <a
          href="foo">
          bar
      </
          a>;
    `,
    $`
      <a
          href="foo">
          bar
      </a
      >;
    `,
    $`
      var foo = <a href="bar">
          baz
      </a>;
    `,
    $`
      var foo = <a
          href="bar"
      >
          baz
      </a>;
    `,
    $`
      var foo = <a
          href="bar">
          baz
      </a>;
    `,
    $`
      var foo = <
          a
          href="bar">
          baz
      </a>;
    `,
    $`
      var foo = <a
          href="bar">
          baz
      </
          a>;
    `,
    $`
      var foo = <a
          href="bar">
          baz
      </a
      >
    `,
    $`
      var foo = (<a
          href="bar">
          baz
      </a>);
    `,
    $`
      var foo = (
          <a href="bar">baz</a>
      );
    `,
    $`
      var foo = (
          <a href="bar">
              baz
          </a>
      );
    `,
    $`
      var foo = (
          <a
              href="bar">
              baz
          </a>
      );
    `,
    'var foo = <a href="bar">baz</a>;',
    $`
      <a>
          {
          }
      </a>
    `,
    $`
      <a>
          {
              foo
          }
      </a>
    `,
    $`
      function foo() {
          return (
              <a>
                  {
                      b.forEach(() => {
                          // comment
                          a = c
                              .d()
                              .e();
                      })
                  }
              </a>
          );
      }
    `,
    '<App></App>',
    $`
      <App>
      </App>
    `,
    {
      code: $`
        <App>
          <Foo />
        </App>
      `,
      options: [2],
    },
    {
      code: $`
        <App>
        <Foo />
        </App>
      `,
      options: [0],
    },
    {
      code: $`
        <App>
        \t<Foo />
        </App>
      `,
      options: ['tab'],
    },
    {
      code: $`
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
    },
    {
      code: $`
        function App() {
          return (<App>
            <Foo />
          </App>);
        }
      `,
      options: [2],
    },
    {
      code: $`
        function App() {
          return (
            <App>
              <Foo />
            </App>
          );
        }
      `,
      options: [2],
    },
    {
      code: $`
        it(
          (
            <div>
              <span />
            </div>
          )
        )
      `,
      options: [2],
    },
    {
      code: $`
        it(
          (<div>
            <span />
            <span />
            <span />
          </div>)
        )
      `,
      options: [2],
    },
    {
      code: $`
        (
          <div>
            <span />
          </div>
        )
      `,
      options: [2],
    },
    {
      code: $`
        {
          head.title &&
          <h1>
            {head.title}
          </h1>
        }
      `,
      options: [2],
    },
    {
      code: $`
        {
          head.title &&
            <h1>
              {head.title}
            </h1>
        }
      `,
      options: [2],
    },
    {
      code: $`
        {
          head.title && (
            <h1>
              {head.title}
            </h1>)
        }
      `,
      options: [2],
    },
    {
      code: $`
        {
          head.title && (
            <h1>
              {head.title}
            </h1>
          )
        }
      `,
      options: [2],
    },
    {
      code: $`
        [
          <div />,
          <div />
        ]
      `,
      options: [2],
    },
    $`
      <div>
          {
              [
                  <Foo />,
                  <Bar />
              ]
          }
      </div>
    `,
    $`
      <div>
          {foo &&
              [
                  <Foo />,
                  <Bar />
              ]
          }
      </div>
    `,
    $`
      <div>
          bar <div>
              bar
              bar {foo}
              bar </div>
      </div>
    `,
    $`
      foo ?
          <Foo /> :
          <Bar />
    `,
    $`
      foo ?
          <Foo />
          : <Bar />
    `,
    $`
      foo ?
          <Foo />
          :
          <Bar />
    `,
    $`
      <div>
          {!foo ?
              <Foo
                  onClick={this.onClick}
              />
              :
              <Bar
                  onClick={this.onClick}
              />
          }
      </div>
    `,
    {
      code: $`
        <span>
          {condition ?
            <Thing
              foo={\`bar\`}
            /> :
            <Thing/>
          }
        </span>
      `,
      options: [2],
    },
    {
      code: $`
        <span>
          {condition ?
            <Thing
              foo={"bar"}
            /> :
            <Thing/>
          }
        </span>
      `,
      options: [2],
    },
    {
      code: $`
        function foo() {
          <span>
            {condition ?
              <Thing
                foo={bar}
              /> :
              <Thing/>
            }
          </span>
        }
      `,
      options: [2],
    },
    $`
      <App foo
      />
    `,
    {
      code: $`
        <App
          foo
        />
      `,
      options: [2],
    },
    {
      code: $`
        <App
        foo
        />
      `,
      options: [0],
    },
    {
      code: $`
        <App
        \tfoo
        />
      `,
      options: ['tab'],
    },
    $`
      <App
          foo
      />
    `,
    $`
      <App
          foo
      ></App>
    `,
    {
      code: $`
        <App
          foo={function() {
            console.log('bar');
          }}
        />
      `,
      options: [2],
    },
    {
      code: $`
        <App foo={function() {
          console.log('bar');
        }}
        />
      `,
      options: [2],
    },
    {
      code: $`
        var x = function() {
          return <App
            foo={function() {
              console.log('bar');
            }}
          />
        }
      `,
      options: [2],
    },
    {
      code: $`
        var x = <App
          foo={function() {
            console.log('bar');
          }}
        />
      `,
      options: [2],
    },
    {
      code: $`
        <Provider
          store
        >
          <App
            foo={function() {
              console.log('bar');
            }}
          />
        </Provider>
      `,
      options: [2],
    },
    {
      code: $`
        <Provider
          store
        >
          {baz && <App
            foo={function() {
              console.log('bar');
            }}
          />}
        </Provider>
      `,
      options: [2],
    },
    {
      code: $`
        <App
        \tfoo
        />
      `,
      options: ['tab'],
    },
    {
      code: $`
        <App
        \tfoo
        ></App>
      `,
      options: ['tab'],
    },
    {
      code: $`
        <App foo={function() {
        \tconsole.log('bar');
        }}
        />
      `,
      options: ['tab'],
    },
    {
      code: $`
        var x = <App
        \tfoo={function() {
        \t\tconsole.log('bar');
        \t}}
        />
      `,
      options: ['tab'],
    },
    $`
      <App
          foo />
    `,
    $`
      <div>
          unrelated{
              foo
          }
      </div>
    `,
    $`
      <div>unrelated{
          foo
      }
      </div>
    `,
    $`
      <
          foo
              .bar
              .baz
      >
          foo
      </
          foo.
              bar.
              baz
      >
    `,
    $`
      <
          input
          type=
              "number"
      />
    `,
    $`
      <
          input
          type=
              {'number'}
      />
    `,
    $`
      <
          input
          type
              ="number"
      />
    `,
    $`
      foo ? (
          bar
      ) : (
          baz
      )
    `,
    $`
      foo ? (
          <div>
          </div>
      ) : (
          <span>
          </span>
      )
    `,
    $`
      <div>
          {
              /* foo */
          }
      </div>
    `,

    /**
     *         JSX Fragments
     * https://github.com/eslint/eslint/issues/12208
     */
    $`
      <>
          <A />
      </>
    `,
    $`
      <
      >
          <A />
      </>
    `,
    $`
      <>
          <A />
      <
      />
    `,
    $`
      <>
          <A />
      </
      >
    `,
    $`
      <
      >
          <A />
      </
      >
    `,
    $`
      <
      >
          <A />
      <
      />
    `,
    $`
      < // Comment
      >
          <A />
      </>
    `,
    $`
      <
          // Comment
      >
          <A />
      </>
    `,
    $`
      <
      // Comment
      >
          <A />
      </>
    `,
    $`
      <>
          <A />
      < // Comment
      />
    `,
    $`
      <>
          <A />
      <
          // Comment
      />
    `,
    $`
      <>
          <A />
      <
      // Comment
      />
    `,
    $`
      <>
          <A />
      </ // Comment
      >
    `,
    $`
      <>
          <A />
      </
          // Comment
      >
    `,
    $`
      <>
          <A />
      </
      // Comment
      >
    `,
    $`
      < /* Comment */
      >
          <A />
      </>
    `,
    $`
      <
          /* Comment */
      >
          <A />
      </>
    `,
    $`
      <
      /* Comment */
      >
          <A />
      </>
    `,
    $`
      <
          /**                 * Comment
           */
      >
          <A />
      </>
    `,
    $`
      <
      /**             * Comment
       */
      >
          <A />
      </>
    `,
    $`
      <>
          <A />
      < /* Comment */
      />
    `,
    $`
      <>
          <A />
      <
          /* Comment */ />
    `,
    $`
      <>
          <A />
      <
      /* Comment */ />
    `,
    $`
      <>
          <A />
      <
          /* Comment */
      />
    `,
    $`
      <>
          <A />
      <
      /* Comment */
      />
    `,
    $`
      <>
          <A />
      </ /* Comment */
      >
    `,
    $`
      <>
          <A />
      </
          /* Comment */ >
    `,
    $`
      <>
          <A />
      </
      /* Comment */ >
    `,
    $`
      <>
          <A />
      </
          /* Comment */
      >
    `,
    $`
      <>
          <A />
      </
      /* Comment */
      >
    `,

    // https://github.com/eslint/eslint/issues/8832
    $`
      <div>
          {
              (
                  1
              )
          }
      </div>
    `,
    $`
      function A() {
          return (
              <div>
                  {
                      b && (
                          <div>
                          </div>
                      )
                  }
              </div>
          );
      }
    `,
    $`
      <div>foo
          <div>bar</div>
      </div>
    `,
    $`
      <small>Foo bar&nbsp;
          <a>baz qux</a>.
      </small>
    `,
    $`
      <div
          {...props}
      />
    `,
    $`
      <div
          {
              ...props
          }
      />
    `,
    {
      code: $`
        a(b
          , c
        )
      `,
      options: [2, { CallExpression: { arguments: 'off' } }],
    },
    {
      code: $`
        a(
          new B({
            c,
          })
        );
      `,
      options: [2, { CallExpression: { arguments: 'off' } }],
    },
    {
      code: $`
        foo
        ? bar
                    : baz
      `,
      options: [4, { ignoredNodes: ['ConditionalExpression'] }],
    },
    {
      code: $`
        class Foo {
        foo() {
            bar();
        }
        }
      `,
      options: [4, { ignoredNodes: ['ClassBody'] }],
    },
    {
      code: $`
        class Foo {
        foo() {
        bar();
        }
        }
      `,
      options: [4, { ignoredNodes: ['ClassBody', 'BlockStatement'] }],
    },
    {
      code: $`
        foo({
                bar: 1
            },
            {
                baz: 2
            },
            {
                qux: 3
        })
      `,
      options: [4, { ignoredNodes: ['CallExpression > ObjectExpression'] }],
    },
    {
      code: $`
        foo
                                    .bar
      `,
      options: [4, { ignoredNodes: ['MemberExpression'] }],
    },
    {
      code: $`
        $(function() {
        
        foo();
        bar();
        
        });
      `,
      options: [4, {
        ignoredNodes: ['Program > ExpressionStatement > CallExpression[callee.name=\'$\'] > FunctionExpression > BlockStatement'],
      }],
    },
    {
      code: $`
        <Foo
                    bar="1" />
      `,
      options: [4, { ignoredNodes: ['JSXOpeningElement'] }],
    },
    {
      code: $`
        foo &&
        <Bar
        >
        </Bar>
      `,
      options: [4, { ignoredNodes: ['JSXElement', 'JSXOpeningElement'] }],
    },
    {
      code: $`
        (function($) {
        $(function() {
            foo;
        });
        }())
      `,
      options: [4, { ignoredNodes: ['ExpressionStatement > CallExpression > FunctionExpression.callee > BlockStatement'] }],
    },
    {
      code: $`
        const value = (
            condition ?
            valueIfTrue :
            valueIfFalse
        );
      `,
      options: [4, { ignoredNodes: ['ConditionalExpression'] }],
    },
    {
      code: $`
        var a = 0, b = 0, c = 0;
        export default foo(
            a,
            b, {
            c
            }
        )
      `,
      options: [4, { ignoredNodes: ['ExportDefaultDeclaration > CallExpression > ObjectExpression'] }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: $`
        foobar = baz
               ? qux
               : boop
      `,
      options: [4, { ignoredNodes: ['ConditionalExpression'] }],
    },
    {
      code: $`
        \`
            SELECT
                \${
                    foo
                } FROM THE_DATABASE
        \`
      `,
      options: [4, { ignoredNodes: ['TemplateLiteral'] }],
    },
    {
      code: $`
        <foo
            prop='bar'
            >
            Text
        </foo>
      `,
      options: [4, { ignoredNodes: ['JSXOpeningElement'] }],
    },
    {
      code: $`
        var x = 1,
            y = 2;
        var z;
      `,
      options: ['tab', { ignoredNodes: ['VariableDeclarator'] }],
    },
    {
      code: $`
        [
            foo(),
            bar
        ]
      `,
      options: ['tab', { ArrayExpression: 'first', ignoredNodes: ['CallExpression'] }],
    },
    {
      code: $`
        if (foo) {
            doSomething();
        
        // Intentionally unindented comment
            doSomethingElse();
        }
      `,
      options: [4, { ignoreComments: true }],
    },
    {
      code: $`
        if (foo) {
            doSomething();
        
        /* Intentionally unindented comment */
            doSomethingElse();
        }
      `,
      options: [4, { ignoreComments: true }],
    },
    $`
      const obj = {
          foo () {
              return condition ? // comment
                  1 :
                  2
          }
      }
    `,

    // ----------------------------------------------------------------------
    // Comment alignment tests
    // ----------------------------------------------------------------------
    $`
      if (foo) {
      // Comment can align with code immediately above even if "incorrect" alignment
          doSomething();
      }
    `,
    $`
      if (foo) {
          doSomething();
      // Comment can align with code immediately below even if "incorrect" alignment
      }
    `,
    $`
      if (foo) {
          // Comment can be in correct alignment even if not aligned with code above/below
      }
    `,
    $`
      if (foo) {
      
          // Comment can be in correct alignment even if gaps between (and not aligned with) code above/below
      
      }
    `,
    $`
      [{
          foo
      },
      
      // Comment between nodes
      
      {
          bar
      }];
    `,
    $`
      [{
          foo
      },
      
      // Comment between nodes
      
      { // comment
          bar
      }];
    `,
    $`
      let foo
      
      // comment
      
      ;(async () => {})()
    `,
    $`
      let foo
      // comment
      
      ;(async () => {})()
    `,
    $`
      let foo
      
      // comment
      ;(async () => {})()
    `,
    $`
      let foo
      // comment
      ;(async () => {})()
    `,
    $`
      let foo
      
          /* comment */;
      
      (async () => {})()
    `,
    $`
      let foo
          /* comment */;
      
      (async () => {})()
    `,
    $`
      let foo
      
          /* comment */;
      (async () => {})()
    `,
    $`
      let foo
          /* comment */;
      (async () => {})()
    `,
    $`
      let foo
      /* comment */;
      
      (async () => {})()
    `,
    $`
      let foo
      /* comment */;
      (async () => {})()
    `,
    $`
      // comment
      
      ;(async () => {})()
    `,
    $`
      // comment
      ;(async () => {})()
    `,
    $`
      {
          let foo
      
          // comment
      
          ;(async () => {})()
      }
    `,
    $`
      {
          let foo
          // comment
          ;(async () => {})()
      }
    `,
    $`
      {
          // comment
      
          ;(async () => {})()
      }
    `,
    $`
      {
          // comment
          ;(async () => {})()
      }
    `,
    $`
      const foo = 1
      const bar = foo
      
      /* comment */
      
      ;[1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      /* comment */
      
      ;[1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      
      /* comment */
      ;[1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      /* comment */
      ;[1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      
          /* comment */;
      
      [1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
          /* comment */;
      
      [1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      
          /* comment */;
      [1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
          /* comment */;
      [1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      /* comment */;
      
      [1, 2, 3].forEach(() => {})
    `,
    $`
      const foo = 1
      const bar = foo
      /* comment */;
      [1, 2, 3].forEach(() => {})
    `,
    $`
      /* comment */
      
      ;[1, 2, 3].forEach(() => {})
    `,
    $`
      /* comment */
      ;[1, 2, 3].forEach(() => {})
    `,
    $`
      {
          const foo = 1
          const bar = foo
      
          /* comment */
      
          ;[1, 2, 3].forEach(() => {})
      }
    `,
    $`
      {
          const foo = 1
          const bar = foo
          /* comment */
          ;[1, 2, 3].forEach(() => {})
      }
    `,
    $`
      {
          /* comment */
      
          ;[1, 2, 3].forEach(() => {})
      }
    `,
    $`
      {
          /* comment */
          ;[1, 2, 3].forEach(() => {})
      }
    `,

    // import expressions
    {
      code: $`
        import(
            // before
            source
            // after
        )
      `,
      parserOptions: { ecmaVersion: 2020 },
    },

    // https://github.com/eslint/eslint/issues/12122
    {
      code: $`
        foo(() => {
            tag\`
            multiline
            template
            literal
            \`(() => {
                bar();
            });
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        {
            tag\`
            multiline
            template
            \${a} \${b}
            literal
            \`(() => {
                bar();
            });
        }
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo(() => {
            tagOne\`
            multiline
            template
            literal
            \${a} \${b}
            \`(() => {
                tagTwo\`
                multiline
                template
                literal
                \`(() => {
                    bar();
                });
        
                baz();
            });
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        {
            tagOne\`
            \${a} \${b}
            multiline
            template
            literal
            \`(() => {
                tagTwo\`
                multiline
                template
                literal
                \`(() => {
                    bar();
                });
        
                baz();
            });
        };
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        tagOne\`multiline
                \${a} \${b}
                template
                literal
                \`(() => {
            foo();
        
            tagTwo\`multiline
                    template
                    literal
                \`({
                bar: 1,
                baz: 2
            });
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        tagOne\`multiline
            template
            literal
            \${a} \${b}\`({
            foo: 1,
            bar: tagTwo\`multiline
                template
                literal\`(() => {
        
                baz();
            })
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo.bar\` template literal \`(() => {
            baz();
        })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo.bar.baz\` template literal \`(() => {
            baz();
        })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo
            .bar\` template
                literal \`(() => {
                baz();
            })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo
            .bar
            .baz\` template
                literal \`(() => {
                baz();
            })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo.bar\`
            \${a} \${b}
            \`(() => {
            baz();
        })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo.bar1.bar2\`
            \${a} \${b}
            \`(() => {
            baz();
        })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo
            .bar1
            .bar2\`
            \${a} \${b}
            \`(() => {
                baz();
            })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo
            .bar\`
            \${a} \${b}
            \`(() => {
                baz();
            })
      `,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo
        .test\`
            \${a} \${b}
            \`(() => {
            baz();
        })
      `,
      options: [4, { MemberExpression: 0 }],
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        foo
                .test\`
            \${a} \${b}
            \`(() => {
                    baz();
                })
      `,
      options: [4, { MemberExpression: 2 }],
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: $`
        const foo = async (arg1,
                           arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
    },
    {
      code: $`
        const foo = async /* some comments */(arg1,
                                              arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
    },
    {
      code: $`
        const a = async
        b => {}
      `,
      options: [2],
    },
    {
      code: $`
        const foo = (arg1,
                     arg2) => async (arr1,
                                     arr2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
    },
    {
      code: $`
        const foo = async (arg1,
          arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2],
    },
    {
      code: $`
        const foo = async /*comments*/(arg1,
          arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2],
    },
    {
      code: $`
        const foo = async (arg1,
                arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 4 }, FunctionExpression: { parameters: 4 } }],
    },
    {
      code: $`
        const foo = (arg1,
                arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 4 }, FunctionExpression: { parameters: 4 } }],
    },
    {
      code: $`
        async function fn(ar1,
                          ar2){}
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
    },
    {
      code: $`
        async function /* some comments */ fn(ar1,
                                              ar2){}
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
    },
    {
      code: $`
        async  /* some comments */  function fn(ar1,
                                                ar2){}
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
    },
    {
      code: $`
        class C {
          static {
            foo();
            bar();
          }
        }
      `,
      options: [2],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {
                foo();
                bar();
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {
                    foo();
                    bar();
            }
        }
      `,
      options: [4, { StaticBlock: { body: 2 } }],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {
            foo();
            bar();
            }
        }
      `,
      options: [4, { StaticBlock: { body: 0 } }],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
        \tstatic {
        \t\tfoo();
        \t\tbar();
        \t}
        }
      `,
      options: ['tab'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
        \tstatic {
        \t\t\tfoo();
        \t\t\tbar();
        \t}
        }
      `,
      options: ['tab', { StaticBlock: { body: 2 } }],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static
            {
                foo();
                bar();
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {
                var x,
                    y;
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static
            {
                var x,
                    y;
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {
                if (foo) {
                    bar;
                }
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {
                {
                    bar;
                }
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            static {}
        
            static {
            }
        
            static
            {
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
        
            static {
                foo;
            }
        
            static {
                bar;
            }
        
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
        
            x = 1;
        
            static {
                foo;
            }
        
            y = 2;
        
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
        
            method1(param) {
                foo;
            }
        
            static {
                bar;
            }
        
            method2(param) {
                foo;
            }
        
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        function f() {
            class C {
                static {
                    foo();
                    bar();
                }
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: $`
        class C {
            method() {
                    foo;
            }
            static {
                    bar;
            }
        }
      `,
      options: [4, { FunctionExpression: { body: 2 }, StaticBlock: { body: 2 } }],
      parserOptions: { ecmaVersion: 2022 },
    },

    // https://github.com/eslint/eslint/issues/15930
    {
      code: $`
        if (2 > 1)
        \tconsole.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: ['tab'],
    },
    {
      code: $`
        if (2 > 1)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },
    {
      code: $`
        if (foo) bar();
        baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo) bar()
        ;baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar();
        baz();
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar()
        ; baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar()
        ;baz()
        qux()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar()
        ;else
            baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar()
        else
            baz()
        ;qux()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            if (bar)
                baz()
        ;qux()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar()
        else if (baz)
            qux()
        ;quux()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            if (bar)
                baz()
            else
                qux()
        ;quux()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            bar()
            ;
        baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            ;
        baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
        ;baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo);
        else
            baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
            ;
        else
            baz()
      `,
      options: [4],
    },
    {
      code: $`
        if (foo)
        ;else
            baz()
      `,
      options: [4],
    },
    {
      code: $`
        do foo();
        while (bar)
      `,
      options: [4],
    },
    {
      code: $`
        do foo()
        ;while (bar)
      `,
      options: [4],
    },
    {
      code: $`
        do
            foo();
        while (bar)
      `,
      options: [4],
    },
    {
      code: $`
        do
            foo()
        ;while (bar)
      `,
      options: [4],
    },
    {
      code: $`
        do;
        while (foo)
      `,
      options: [4],
    },
    {
      code: $`
        do
            ;
        while (foo)
      `,
      options: [4],
    },
    {
      code: $`
        do
        ;while (foo)
      `,
      options: [4],
    },
    {
      code: $`
        while (2 > 1)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },
    {
      code: $`
        for (;;)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },
    {
      code: $`
        for (a in b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },
    {
      code: $`
        for (a of b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },
    {
      code: $`
        with (a)
            console.log(b)
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        label: for (a of b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },
    {
      code: $`
        label:
        for (a of b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
    },

    // https://github.com/eslint/eslint/issues/17316
    {
      code: $`
        if (foo)
        \tif (bar) doSomething();
        \telse doSomething();
        else
        \tif (bar) doSomething();
        \telse doSomething();
      `,
      options: ['tab'],
    },
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (bar) doSomething();
          else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (bar)
              doSomething();
          else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (bar) doSomething();
          else
              doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (bar)
              doSomething();
          else
              doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (bar) doSomething();
      else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (bar)
          doSomething();
      else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (bar) doSomething();
      else
          doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (bar)
          doSomething();
      else
          doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (foo)
              if (bar) doSomething();
              else doSomething();
          else
              if (bar) doSomething();
              else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (foo)
              if (bar) doSomething();
              else
                  if (bar) doSomething();
                  else doSomething();
          else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (foo) doSomething();
      else doSomething();
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (foo) {
          doSomething();
      }
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else if (foo)
      {
          doSomething();
      }
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (foo) {
              doSomething();
          }
    `,
    $`
      if (foo)
          if (bar) doSomething();
          else doSomething();
      else
          if (foo)
          {
              doSomething();
          }
    `,
  ],

  invalid: [
    {
      code: $`
        var a = b;
        if (a) {
        b();
        }
      `,
      output: $`
        var a = b;
        if (a) {
          b();
        }
      `,
      options: [2],
      errors: expectedErrors([[3, 2, 0, 'Identifier']]),
    },
    {
      code: $`
        require('http').request({hostname: 'localhost',
                          port: 80}, function(res) {
            res.end();
          });
      `,
      output: $`
        require('http').request({hostname: 'localhost',
          port: 80}, function(res) {
          res.end();
        });
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 18, 'Identifier'], [3, 2, 4, 'Identifier'], [4, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        if (array.some(function(){
          return true;
        })) {
        a++; // ->
          b++;
            c++; // <-
        }
      `,
      output: $`
        if (array.some(function(){
          return true;
        })) {
          a++; // ->
          b++;
          c++; // <-
        }
      `,
      options: [2],
      errors: expectedErrors([[4, 2, 0, 'Identifier'], [6, 2, 4, 'Identifier']]),
    },
    {
      code: $`
        if (a){
        \tb=c;
        \t\tc=d;
        e=f;
        }
      `,
      output: $`
        if (a){
        \tb=c;
        \tc=d;
        \te=f;
        }
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [[3, 1, 2, 'Identifier'], [4, 1, 0, 'Identifier']]),
    },
    {
      code: $`
        if (a){
            b=c;
              c=d;
         e=f;
        }
      `,
      output: $`
        if (a){
            b=c;
            c=d;
            e=f;
        }
      `,
      options: [4],
      errors: expectedErrors([[3, 4, 6, 'Identifier'], [4, 4, 1, 'Identifier']]),
    },
    {
      code: fixture,
      output: fixedFixture,
      options: [2, { SwitchCase: 1, MemberExpression: 1, CallExpression: { arguments: 'off' } }],
      errors: expectedErrors([
        [5, 2, 4, 'Keyword'],
        [6, 2, 0, 'Line'],
        [10, 4, 6, 'Punctuator'],
        [11, 2, 4, 'Punctuator'],

        [15, 4, 2, 'Identifier'],
        [16, 2, 4, 'Punctuator'],
        [23, 2, 4, 'Punctuator'],
        [29, 2, 4, 'Keyword'],
        [30, 4, 6, 'Identifier'],
        [36, 4, 6, 'Identifier'],
        [38, 2, 4, 'Punctuator'],
        [39, 4, 2, 'Identifier'],
        [40, 2, 0, 'Punctuator'],
        [54, 2, 4, 'Punctuator'],
        [114, 4, 2, 'Keyword'],
        [120, 4, 6, 'Keyword'],
        [124, 4, 2, 'Keyword'],
        [134, 4, 6, 'Keyword'],
        [138, 2, 3, 'Punctuator'],
        [139, 2, 3, 'Punctuator'],
        [143, 4, 0, 'Identifier'],
        [144, 6, 2, 'Punctuator'],
        [145, 6, 2, 'Punctuator'],
        [151, 4, 6, 'Identifier'],
        [152, 6, 8, 'Punctuator'],
        [153, 6, 8, 'Punctuator'],
        [159, 4, 2, 'Identifier'],
        [161, 4, 6, 'Identifier'],
        [175, 2, 0, 'Identifier'],
        [177, 2, 4, 'Identifier'],
        [189, 2, 0, 'Keyword'],
        [192, 6, 18, 'Identifier'],
        [193, 6, 4, 'Identifier'],
        [195, 6, 8, 'Identifier'],
        [228, 5, 4, 'Identifier'],
        [231, 3, 2, 'Punctuator'],
        [245, 0, 2, 'Punctuator'],
        [248, 0, 2, 'Punctuator'],
        [304, 4, 6, 'Identifier'],
        [306, 4, 8, 'Identifier'],
        [307, 2, 4, 'Punctuator'],
        [308, 2, 4, 'Identifier'],
        [311, 4, 6, 'Identifier'],
        [312, 4, 6, 'Identifier'],
        [313, 4, 6, 'Identifier'],
        [314, 2, 4, 'Punctuator'],
        [315, 2, 4, 'Identifier'],
        [318, 4, 6, 'Identifier'],
        [319, 4, 6, 'Identifier'],
        [320, 4, 6, 'Identifier'],
        [321, 2, 4, 'Punctuator'],
        [322, 2, 4, 'Identifier'],
        [326, 2, 1, 'Numeric'],
        [327, 2, 1, 'Numeric'],
        [328, 2, 1, 'Numeric'],
        [329, 2, 1, 'Numeric'],
        [330, 2, 1, 'Numeric'],
        [331, 2, 1, 'Numeric'],
        [332, 2, 1, 'Numeric'],
        [333, 2, 1, 'Numeric'],
        [334, 2, 1, 'Numeric'],
        [335, 2, 1, 'Numeric'],
        [340, 2, 4, 'Identifier'],
        [341, 2, 0, 'Identifier'],
        [344, 2, 4, 'Identifier'],
        [345, 2, 0, 'Identifier'],
        [348, 2, 4, 'Identifier'],
        [349, 2, 0, 'Identifier'],
        [355, 2, 0, 'Identifier'],
        [357, 2, 4, 'Identifier'],
        [361, 4, 6, 'Identifier'],
        [362, 2, 4, 'Punctuator'],
        [363, 2, 4, 'Identifier'],
        [368, 2, 0, 'Keyword'],
        [370, 2, 4, 'Keyword'],
        [374, 4, 6, 'Keyword'],
        [376, 4, 2, 'Keyword'],
        [383, 2, 0, 'Identifier'],
        [385, 2, 4, 'Identifier'],
        [390, 2, 0, 'Identifier'],
        [392, 2, 4, 'Identifier'],
        [409, 2, 0, 'Identifier'],
        [410, 2, 4, 'Identifier'],
        [416, 2, 0, 'Identifier'],
        [417, 2, 4, 'Identifier'],
        [418, 0, 4, 'Punctuator'],
        [422, 2, 4, 'Identifier'],
        [423, 2, 0, 'Identifier'],
        [427, 2, 6, 'Identifier'],
        [428, 2, 8, 'Identifier'],
        [429, 2, 4, 'Identifier'],
        [430, 0, 4, 'Punctuator'],
        [433, 2, 4, 'Identifier'],
        [434, 0, 4, 'Punctuator'],
        [437, 2, 0, 'Identifier'],
        [438, 0, 4, 'Punctuator'],
        [442, 2, 4, 'Identifier'],
        [443, 2, 4, 'Identifier'],
        [444, 0, 2, 'Punctuator'],
        [451, 2, 0, 'Identifier'],
        [453, 2, 4, 'Identifier'],
        [499, 6, 8, 'Punctuator'],
        [500, 8, 6, 'Identifier'],
        [504, 4, 6, 'Punctuator'],
        [505, 6, 8, 'Identifier'],
        [506, 4, 8, 'Punctuator'],
      ]),
      parserOptions: { ecmaVersion: 6, sourceType: 'script' },
    },
    {
      code: $`
        switch(value){
            case "1":
                a();
            break;
            case "2":
                a();
            break;
            default:
                a();
                break;
        }
      `,
      output: $`
        switch(value){
            case "1":
                a();
                break;
            case "2":
                a();
                break;
            default:
                a();
                break;
        }
      `,
      options: [4, { SwitchCase: 1 }],
      errors: expectedErrors([[4, 8, 4, 'Keyword'], [7, 8, 4, 'Keyword']]),
    },
    {
      code: $`
        var x = 0 &&
            {
               a: 1,
                  b: 2
            };
      `,
      output: $`
        var x = 0 &&
            {
                a: 1,
                b: 2
            };
      `,
      options: [4],
      errors: expectedErrors([[3, 8, 7, 'Identifier'], [4, 8, 10, 'Identifier']]),
    },
    {
      code: $`
        switch(value){
            case "1":
                a();
                break;
            case "2":
                a();
                break;
            default:
            break;
        }
      `,
      output: $`
        switch(value){
            case "1":
                a();
                break;
            case "2":
                a();
                break;
            default:
                break;
        }
      `,
      options: [4, { SwitchCase: 1 }],
      errors: expectedErrors([9, 8, 4, 'Keyword']),
    },
    {
      code: $`
        switch(value){
            case "1":
            case "2":
                a();
                break;
            default:
                break;
        }
        switch(value){
            case "1":
            break;
            case "2":
                a();
            break;
            default:
                a();
            break;
        }
      `,
      output: $`
        switch(value){
            case "1":
            case "2":
                a();
                break;
            default:
                break;
        }
        switch(value){
            case "1":
                break;
            case "2":
                a();
                break;
            default:
                a();
                break;
        }
      `,
      options: [4, { SwitchCase: 1 }],
      errors: expectedErrors([[11, 8, 4, 'Keyword'], [14, 8, 4, 'Keyword'], [17, 8, 4, 'Keyword']]),
    },
    {
      code: $`
        switch(value){
        case "1":
                a();
                break;
            case "2":
                break;
            default:
                break;
        }
      `,
      output: $`
        switch(value){
        case "1":
            a();
            break;
        case "2":
            break;
        default:
            break;
        }
      `,
      options: [4],
      errors: expectedErrors([
        [3, 4, 8, 'Identifier'],
        [4, 4, 8, 'Keyword'],
        [5, 0, 4, 'Keyword'],
        [6, 4, 8, 'Keyword'],
        [7, 0, 4, 'Keyword'],
        [8, 4, 8, 'Keyword'],
      ]),
    },
    {
      code: $`
        var obj = {foo: 1, bar: 2};
        with (obj) {
        console.log(foo + bar);
        }
      `,
      output: $`
        var obj = {foo: 1, bar: 2};
        with (obj) {
            console.log(foo + bar);
        }
      `,
      errors: expectedErrors([3, 4, 0, 'Identifier']),
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        switch (a) {
        case '1':
        b();
        break;
        default:
        c();
        break;
        }
      `,
      output: $`
        switch (a) {
            case '1':
                b();
                break;
            default:
                c();
                break;
        }
      `,
      options: [4, { SwitchCase: 1 }],
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 8, 0, 'Identifier'],
        [4, 8, 0, 'Keyword'],
        [5, 4, 0, 'Keyword'],
        [6, 8, 0, 'Identifier'],
        [7, 8, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        var foo = function(){
            foo
                  .bar
        }
      `,
      output: $`
        var foo = function(){
            foo
                .bar
        }
      `,
      options: [4, { MemberExpression: 1 }],
      errors: expectedErrors(
        [3, 8, 10, 'Punctuator'],
      ),
    },
    {
      code: $`
        (
            foo
            .bar
        )
      `,
      output: $`
        (
            foo
                .bar
        )
      `,
      errors: expectedErrors([3, 8, 4, 'Punctuator']),
    },
    {
      code: $`
        var foo = function(){
            foo
                     .bar
        }
      `,
      output: $`
        var foo = function(){
            foo
                    .bar
        }
      `,
      options: [4, { MemberExpression: 2 }],
      errors: expectedErrors(
        [3, 12, 13, 'Punctuator'],
      ),
    },
    {
      code: $`
        var foo = () => {
            foo
                     .bar
        }
      `,
      output: $`
        var foo = () => {
            foo
                    .bar
        }
      `,
      options: [4, { MemberExpression: 2 }],
      errors: expectedErrors(
        [3, 12, 13, 'Punctuator'],
      ),
    },
    {
      code: $`
        TestClass.prototype.method = function () {
          return Promise.resolve(3)
              .then(function (x) {
              return x;
            });
        };
      `,
      output: $`
        TestClass.prototype.method = function () {
          return Promise.resolve(3)
            .then(function (x) {
              return x;
            });
        };
      `,
      options: [2, { MemberExpression: 1 }],
      errors: expectedErrors([3, 4, 6, 'Punctuator']),
    },
    {
      code: $`
        while (a)
        b();
      `,
      output: $`
        while (a)
            b();
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        lmn = [{
                a: 1
            },
            {
                b: 2
            },
            {
                x: 2
        }];
      `,
      output: $`
        lmn = [{
            a: 1
        },
        {
            b: 2
        },
        {
            x: 2
        }];
      `,
      errors: expectedErrors([
        [2, 4, 8, 'Identifier'],
        [3, 0, 4, 'Punctuator'],
        [4, 0, 4, 'Punctuator'],
        [5, 4, 8, 'Identifier'],
        [6, 0, 4, 'Punctuator'],
        [7, 0, 4, 'Punctuator'],
        [8, 4, 8, 'Identifier'],
      ]),
    },
    {
      code: $`
        for (var foo = 1;
        foo < 10;
        foo++) {}
      `,
      output: $`
        for (var foo = 1;
            foo < 10;
            foo++) {}
      `,
      errors: expectedErrors([[2, 4, 0, 'Identifier'], [3, 4, 0, 'Identifier']]),
    },
    {
      code: $`
        for (
        var foo = 1;
        foo < 10;
        foo++
            ) {}
      `,
      output: $`
        for (
            var foo = 1;
            foo < 10;
            foo++
        ) {}
      `,
      errors: expectedErrors([[2, 4, 0, 'Keyword'], [3, 4, 0, 'Identifier'], [4, 4, 0, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        for (;;)
        b();
      `,
      output: $`
        for (;;)
            b();
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        for (a in x)
        b();
      `,
      output: $`
        for (a in x)
            b();
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        do
        b();
        while(true)
      `,
      output: $`
        do
            b();
        while(true)
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        with(a)
        b();
      `,
      output: $`
        with(a)
            b();
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
      ]),
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        if(true)
        b();
      `,
      output: $`
        if(true)
            b();
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        var test = {
              a: 1,
            b: 2
            };
      `,
      output: $`
        var test = {
          a: 1,
          b: 2
        };
      `,
      options: [2],
      errors: expectedErrors([
        [2, 2, 6, 'Identifier'],
        [3, 2, 4, 'Identifier'],
        [4, 0, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        var a = function() {
              a++;
            b++;
                  c++;
            },
            b;
      `,
      output: $`
        var a = function() {
                a++;
                b++;
                c++;
            },
            b;
      `,
      options: [4],
      errors: expectedErrors([
        [2, 8, 6, 'Identifier'],
        [3, 8, 4, 'Identifier'],
        [4, 8, 10, 'Identifier'],
      ]),
    },
    {
      code: $`
        var a = 1,
        b = 2,
        c = 3;
      `,
      output: $`
        var a = 1,
            b = 2,
            c = 3;
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        [a, b,
            c].forEach((index) => {
                index;
            });
      `,
      output: $`
        [a, b,
            c].forEach((index) => {
            index;
        });
      `,
      options: [4],
      errors: expectedErrors([
        [3, 4, 8, 'Identifier'],
        [4, 0, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        [a, b,
        c].forEach(function(index){
          return index;
        });
      `,
      output: $`
        [a, b,
            c].forEach(function(index){
            return index;
        });
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 4, 2, 'Keyword'],
      ]),
    },
    {
      code: $`
        [a, b, c].forEach(function(index){
          return index;
        });
      `,
      output: $`
        [a, b, c].forEach(function(index){
            return index;
        });
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 2, 'Keyword'],
      ]),
    },
    {
      code: $`
        (foo)
            .bar([
            baz
        ]);
      `,
      output: $`
        (foo)
            .bar([
                baz
            ]);
      `,
      options: [4, { MemberExpression: 1 }],
      errors: expectedErrors([[3, 8, 4, 'Identifier'], [4, 4, 0, 'Punctuator']]),
    },
    {
      code: $`
        var x = ['a',
                 'b',
                 'c'
        ];
      `,
      output: $`
        var x = ['a',
            'b',
            'c'
        ];
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 9, 'String'],
        [3, 4, 9, 'String'],
      ]),
    },
    {
      code: $`
        var x = [
                 'a',
                 'b',
                 'c'
        ];
      `,
      output: $`
        var x = [
            'a',
            'b',
            'c'
        ];
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 9, 'String'],
        [3, 4, 9, 'String'],
        [4, 4, 9, 'String'],
      ]),
    },
    {
      code: $`
        var x = [
                 'a',
                 'b',
                 'c',
        'd'];
      `,
      output: $`
        var x = [
            'a',
            'b',
            'c',
            'd'];
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 9, 'String'],
        [3, 4, 9, 'String'],
        [4, 4, 9, 'String'],
        [5, 4, 0, 'String'],
      ]),
    },
    {
      code: $`
        var x = [
                 'a',
                 'b',
                 'c'
          ];
      `,
      output: $`
        var x = [
            'a',
            'b',
            'c'
        ];
      `,
      options: [4],
      errors: expectedErrors([
        [2, 4, 9, 'String'],
        [3, 4, 9, 'String'],
        [4, 4, 9, 'String'],
        [5, 0, 2, 'Punctuator'],
      ]),
    },
    {
      code: $`
        [[
        ], function(
                foo
            ) {}
        ]
      `,
      output: $`
        [[
        ], function(
            foo
        ) {}
        ]
      `,
      errors: expectedErrors([[3, 4, 8, 'Identifier'], [4, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        define([
            'foo'
        ], function(
                bar
            ) {
            baz;
        }
        )
      `,
      output: $`
        define([
            'foo'
        ], function(
            bar
        ) {
            baz;
        }
        )
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        while (1 < 2)
        console.log('foo')
          console.log('bar')
      `,
      output: $`
        while (1 < 2)
          console.log('foo')
        console.log('bar')
      `,
      options: [2],
      errors: expectedErrors([
        [2, 2, 0, 'Identifier'],
        [3, 0, 2, 'Identifier'],
      ]),
    },
    {
      code: $`
        function salutation () {
          switch (1) {
          case 0: return console.log('hi')
            case 1: return console.log('hey')
          }
        }
      `,
      output: $`
        function salutation () {
          switch (1) {
            case 0: return console.log('hi')
            case 1: return console.log('hey')
          }
        }
      `,
      options: [2, { SwitchCase: 1 }],
      errors: expectedErrors([
        [3, 4, 2, 'Keyword'],
      ]),
    },
    {
      code: $`
        var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
        height, rotate;
      `,
      output: $`
        var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
          height, rotate;
      `,
      options: [2, { SwitchCase: 1 }],
      errors: expectedErrors([
        [2, 2, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        switch (a) {
        case '1':
        b();
        break;
        default:
        c();
        break;
        }
      `,
      output: $`
        switch (a) {
                case '1':
                    b();
                    break;
                default:
                    c();
                    break;
        }
      `,
      options: [4, { SwitchCase: 2 }],
      errors: expectedErrors([
        [2, 8, 0, 'Keyword'],
        [3, 12, 0, 'Identifier'],
        [4, 12, 0, 'Keyword'],
        [5, 8, 0, 'Keyword'],
        [6, 12, 0, 'Identifier'],
        [7, 12, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        var geometry,
        rotate;
      `,
      output: $`
        var geometry,
          rotate;
      `,
      options: [2, { VariableDeclarator: 1 }],
      errors: expectedErrors([
        [2, 2, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        var geometry,
          rotate;
      `,
      output: $`
        var geometry,
            rotate;
      `,
      options: [2, { VariableDeclarator: 2 }],
      errors: expectedErrors([
        [2, 4, 2, 'Identifier'],
      ]),
    },
    {
      code: $`
        var geometry,
        \trotate;
      `,
      output: $`
        var geometry,
        \t\trotate;
      `,
      options: ['tab', { VariableDeclarator: 2 }],
      errors: expectedErrors('tab', [
        [2, 2, 1, 'Identifier'],
      ]),
    },
    {
      code: $`
        let geometry,
          rotate;
      `,
      output: $`
        let geometry,
            rotate;
      `,
      options: [2, { VariableDeclarator: 2 }],
      errors: expectedErrors([
        [2, 4, 2, 'Identifier'],
      ]),
    },
    {
      code: $`
        let foo = 'foo',
          bar = bar;
        const a = 'a',
          b = 'b';
      `,
      output: $`
        let foo = 'foo',
            bar = bar;
        const a = 'a',
              b = 'b';
      `,
      options: [2, { VariableDeclarator: 'first' }],
      errors: expectedErrors([
        [2, 4, 2, 'Identifier'],
        [4, 6, 2, 'Identifier'],
      ]),
    },
    {
      code: $`
        var foo = 'foo',
          bar = bar;
      `,
      output: $`
        var foo = 'foo',
            bar = bar;
      `,
      options: [2, { VariableDeclarator: { var: 'first' } }],
      errors: expectedErrors([
        [2, 4, 2, 'Identifier'],
      ]),
    },
    {
      code: $`
        if(true)
          if (true)
            if (true)
            console.log(val);
      `,
      output: $`
        if(true)
          if (true)
            if (true)
              console.log(val);
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([
        [4, 6, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        var a = {
            a: 1,
            b: 2
        }
      `,
      output: $`
        var a = {
          a: 1,
          b: 2
        }
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([
        [2, 2, 4, 'Identifier'],
        [3, 2, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        var a = [
            a,
            b
        ]
      `,
      output: $`
        var a = [
          a,
          b
        ]
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([
        [2, 2, 4, 'Identifier'],
        [3, 2, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        let a = [
            a,
            b
        ]
      `,
      output: $`
        let a = [
          a,
          b
        ]
      `,
      options: [2, { VariableDeclarator: { let: 2 }, SwitchCase: 1 }],
      errors: expectedErrors([
        [2, 2, 4, 'Identifier'],
        [3, 2, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        var a = new Test({
              a: 1
          }),
            b = 4;
      `,
      output: $`
        var a = new Test({
                a: 1
            }),
            b = 4;
      `,
      options: [4],
      errors: expectedErrors([
        [2, 8, 6, 'Identifier'],
        [3, 4, 2, 'Punctuator'],
      ]),
    },
    {
      code: $`
        var a = new Test({
              a: 1
            }),
            b = 4;
        const c = new Test({
              a: 1
            }),
            d = 4;
      `,
      output: $`
        var a = new Test({
              a: 1
            }),
            b = 4;
        const c = new Test({
            a: 1
          }),
          d = 4;
      `,
      options: [2, { VariableDeclarator: { var: 2 } }],
      errors: expectedErrors([
        [6, 4, 6, 'Identifier'],
        [7, 2, 4, 'Punctuator'],
        [8, 2, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        var abc = 5,
            c = 2,
            xyz =
            {
              a: 1,
               b: 2
            };
      `,
      output: $`
        var abc = 5,
            c = 2,
            xyz =
            {
              a: 1,
              b: 2
            };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([6, 6, 7, 'Identifier']),
    },
    {
      code: $`
        var abc =
             {
               a: 1,
                b: 2
             };
      `,
      output: $`
        var abc =
             {
               a: 1,
               b: 2
             };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([4, 7, 8, 'Identifier']),
    },
    {
      code: $`
        var foo = {
            bar: 1,
            baz: {
                qux: 2
              }
          },
          bar = 1;
      `,
      output: $`
        var foo = {
            bar: 1,
            baz: {
              qux: 2
            }
          },
          bar = 1;
      `,
      options: [2],
      errors: expectedErrors([[4, 6, 8, 'Identifier'], [5, 4, 6, 'Punctuator']]),
    },
    {
      code: $`
        var path     = require('path')
         , crypto    = require('crypto')
        ;
      `,
      output: $`
        var path     = require('path')
          , crypto    = require('crypto')
        ;
      `,
      options: [2],
      errors: expectedErrors([
        [2, 2, 1, 'Punctuator'],
      ]),
    },
    {
      code: $`
        var a = 1
           ,b = 2
        ;
      `,
      output: $`
        var a = 1
            ,b = 2
        ;
      `,
      errors: expectedErrors([
        [2, 4, 3, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class A{
          constructor(){}
            a(){}
            get b(){}
        }
      `,
      output: $`
        class A{
            constructor(){}
            a(){}
            get b(){}
        }
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
      errors: expectedErrors([[2, 4, 2, 'Identifier']]),
    },
    {
      code: $`
        var A = class {
          constructor(){}
            a(){}
          get b(){}
        };
      `,
      output: $`
        var A = class {
            constructor(){}
            a(){}
            get b(){}
        };
      `,
      options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
      errors: expectedErrors([[2, 4, 2, 'Identifier'], [4, 4, 2, 'Identifier']]),
    },
    {
      code: $`
        var a = 1,
            B = class {
            constructor(){}
              a(){}
              get b(){}
            };
      `,
      output: $`
        var a = 1,
            B = class {
              constructor(){}
              a(){}
              get b(){}
            };
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([[3, 6, 4, 'Identifier']]),
    },
    {
      code: $`
        {
            if(a){
                foo();
            }
          else{
                bar();
            }
        }
      `,
      output: $`
        {
            if(a){
                foo();
            }
            else{
                bar();
            }
        }
      `,
      options: [4],
      errors: expectedErrors([[5, 4, 2, 'Keyword']]),
    },
    {
      code: $`
        {
            if(a){
                foo();
            }
          else
                bar();
        
        }
      `,
      output: $`
        {
            if(a){
                foo();
            }
            else
                bar();
        
        }
      `,
      options: [4],
      errors: expectedErrors([[5, 4, 2, 'Keyword']]),
    },
    {
      code: $`
        {
            if(a)
                foo();
          else
                bar();
        }
      `,
      output: $`
        {
            if(a)
                foo();
            else
                bar();
        }
      `,
      options: [4],
      errors: expectedErrors([[4, 4, 2, 'Keyword']]),
    },
    {
      code: $`
        (function(){
          function foo(x) {
            return x + 1;
          }
        })();
      `,
      output: $`
        (function(){
        function foo(x) {
          return x + 1;
        }
        })();
      `,
      options: [2, { outerIIFEBody: 0 }],
      errors: expectedErrors([[2, 0, 2, 'Keyword'], [3, 2, 4, 'Keyword'], [4, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        (function(){
            function foo(x) {
                return x + 1;
            }
        })();
      `,
      output: $`
        (function(){
                function foo(x) {
                    return x + 1;
                }
        })();
      `,
      options: [4, { outerIIFEBody: 2 }],
      errors: expectedErrors([[2, 8, 4, 'Keyword'], [3, 12, 8, 'Keyword'], [4, 8, 4, 'Punctuator']]),
    },
    {
      code: $`
        if(data) {
        console.log('hi');
        }
      `,
      output: $`
        if(data) {
          console.log('hi');
        }
      `,
      options: [2, { outerIIFEBody: 0 }],
      errors: expectedErrors([[2, 2, 0, 'Identifier']]),
    },
    {
      code: $`
        var ns = function(){
            function fooVar(x) {
                return x + 1;
            }
        }(x);
      `,
      output: $`
        var ns = function(){
                function fooVar(x) {
                    return x + 1;
                }
        }(x);
      `,
      options: [4, { outerIIFEBody: 2 }],
      errors: expectedErrors([[2, 8, 4, 'Keyword'], [3, 12, 8, 'Keyword'], [4, 8, 4, 'Punctuator']]),
    },
    {
      code: $`
        var obj = {
          foo: function() {
          return true;
          }()
        };
      `,
      output: $`
        var obj = {
          foo: function() {
            return true;
          }()
        };
      `,
      options: [2, { outerIIFEBody: 0 }],
      errors: expectedErrors([[3, 4, 2, 'Keyword']]),
    },
    {
      code: $`
        typeof function() {
            function fooVar(x) {
              return x + 1;
            }
        }();
      `,
      output: $`
        typeof function() {
          function fooVar(x) {
            return x + 1;
          }
        }();
      `,
      options: [2, { outerIIFEBody: 2 }],
      errors: expectedErrors([[2, 2, 4, 'Keyword'], [3, 4, 6, 'Keyword'], [4, 2, 4, 'Punctuator']]),
    },
    {
      code: $`
        {
        \t!function(x) {
        \t\t\t\treturn x + 1;
        \t}()
        };
      `,
      output: $`
        {
        \t!function(x) {
        \t\treturn x + 1;
        \t}()
        };
      `,
      options: ['tab', { outerIIFEBody: 3 }],
      errors: expectedErrors('tab', [[3, 2, 4, 'Keyword']]),
    },
    {
      code: $`
        (function(){
            function foo(x) {
            return x + 1;
            }
        })();
      `,
      output: $`
        (function(){
            function foo(x) {
                return x + 1;
            }
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
      errors: expectedErrors([[3, 8, 4, 'Keyword']]),
    },
    {
      code: $`
        (function(){
        function foo(x) {
        return x + 1;
        }
        })();
      `,
      output: $`
        (function(){
        function foo(x) {
            return x + 1;
        }
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
      errors: expectedErrors([[3, 4, 0, 'Keyword']]),
    },
    {
      code: $`
        (() => {
            function foo(x) {
            return x + 1;
            }
        })();
      `,
      output: $`
        (() => {
            function foo(x) {
                return x + 1;
            }
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
      errors: expectedErrors([[3, 8, 4, 'Keyword']]),
    },
    {
      code: $`
        (() => {
        function foo(x) {
        return x + 1;
        }
        })();
      `,
      output: $`
        (() => {
        function foo(x) {
            return x + 1;
        }
        })();
      `,
      options: [4, { outerIIFEBody: 'off' }],
      errors: expectedErrors([[3, 4, 0, 'Keyword']]),
    },
    {
      code: $`
        Buffer
        .toString()
      `,
      output: $`
        Buffer
            .toString()
      `,
      options: [4, { MemberExpression: 1 }],
      errors: expectedErrors([[2, 4, 0, 'Punctuator']]),
    },
    {
      code: $`
        Buffer
            .indexOf('a')
        .toString()
      `,
      output: $`
        Buffer
            .indexOf('a')
            .toString()
      `,
      options: [4, { MemberExpression: 1 }],
      errors: expectedErrors([[3, 4, 0, 'Punctuator']]),
    },
    {
      code: $`
        Buffer.
        length
      `,
      output: $`
        Buffer.
            length
      `,
      options: [4, { MemberExpression: 1 }],
      errors: expectedErrors([[2, 4, 0, 'Identifier']]),
    },
    {
      code: $`
        Buffer.
        \t\tlength
      `,
      output: $`
        Buffer.
        \tlength
      `,
      options: ['tab', { MemberExpression: 1 }],
      errors: expectedErrors('tab', [[2, 1, 2, 'Identifier']]),
    },
    {
      code: $`
        Buffer
          .foo
          .bar
      `,
      output: $`
        Buffer
            .foo
            .bar
      `,
      options: [2, { MemberExpression: 2 }],
      errors: expectedErrors([[2, 4, 2, 'Punctuator'], [3, 4, 2, 'Punctuator']]),
    },
    {
      code: $`
        function foo() {
            new
            .target
        }
      `,
      output: $`
        function foo() {
            new
                .target
        }
      `,
      errors: expectedErrors([3, 8, 4, 'Punctuator']),
    },
    {
      code: $`
        function foo() {
            new.
            target
        }
      `,
      output: $`
        function foo() {
            new.
                target
        }
      `,
      errors: expectedErrors([3, 8, 4, 'Identifier']),
    },
    {

      // Indentation with multiple else statements: https://github.com/eslint/eslint/issues/6956

      code: $`
        if (foo) bar();
        else if (baz) foobar();
          else if (qux) qux();
      `,
      output: $`
        if (foo) bar();
        else if (baz) foobar();
        else if (qux) qux();
      `,
      options: [2],
      errors: expectedErrors([3, 0, 2, 'Keyword']),
    },
    {
      code: $`
        if (foo) bar();
        else if (baz) foobar();
          else qux();
      `,
      output: $`
        if (foo) bar();
        else if (baz) foobar();
        else qux();
      `,
      options: [2],
      errors: expectedErrors([3, 0, 2, 'Keyword']),
    },
    {
      code: $`
        foo();
          if (baz) foobar();
          else qux();
      `,
      output: $`
        foo();
        if (baz) foobar();
        else qux();
      `,
      options: [2],
      errors: expectedErrors([[2, 0, 2, 'Keyword'], [3, 0, 2, 'Keyword']]),
    },
    {
      code: $`
        if (foo) bar();
        else if (baz) foobar();
             else if (bip) {
               qux();
             }
      `,
      output: $`
        if (foo) bar();
        else if (baz) foobar();
        else if (bip) {
          qux();
        }
      `,
      options: [2],
      errors: expectedErrors([[3, 0, 5, 'Keyword'], [4, 2, 7, 'Identifier'], [5, 0, 5, 'Punctuator']]),
    },
    {
      code: $`
        if (foo) bar();
        else if (baz) {
            foobar();
             } else if (boop) {
               qux();
             }
      `,
      output: $`
        if (foo) bar();
        else if (baz) {
          foobar();
        } else if (boop) {
          qux();
        }
      `,
      options: [2],
      errors: expectedErrors([[3, 2, 4, 'Identifier'], [4, 0, 5, 'Punctuator'], [5, 2, 7, 'Identifier'], [6, 0, 5, 'Punctuator']]),
    },
    {
      code: $`
        function foo(aaa,
            bbb, ccc, ddd) {
              bar();
        }
      `,
      output: $`
        function foo(aaa,
          bbb, ccc, ddd) {
            bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 1, body: 2 } }],
      errors: expectedErrors([[2, 2, 4, 'Identifier'], [3, 4, 6, 'Identifier']]),
    },
    {
      code: $`
        function foo(aaa, bbb,
          ccc, ddd) {
        bar();
        }
      `,
      output: $`
        function foo(aaa, bbb,
              ccc, ddd) {
          bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 3, body: 1 } }],
      errors: expectedErrors([[2, 6, 2, 'Identifier'], [3, 2, 0, 'Identifier']]),
    },
    {
      code: $`
        function foo(aaa,
                bbb,
          ccc) {
              bar();
        }
      `,
      output: $`
        function foo(aaa,
            bbb,
            ccc) {
                    bar();
        }
      `,
      options: [4, { FunctionDeclaration: { parameters: 1, body: 3 } }],
      errors: expectedErrors([[2, 4, 8, 'Identifier'], [3, 4, 2, 'Identifier'], [4, 12, 6, 'Identifier']]),
    },
    {
      code: $`
        function foo(aaa,
          bbb, ccc,
                           ddd, eee, fff) {
           bar();
        }
      `,
      output: $`
        function foo(aaa,
                     bbb, ccc,
                     ddd, eee, fff) {
          bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first', body: 1 } }],
      errors: expectedErrors([[2, 13, 2, 'Identifier'], [3, 13, 19, 'Identifier'], [4, 2, 3, 'Identifier']]),
    },
    {
      code: $`
        function foo(aaa, bbb)
        {
        bar();
        }
      `,
      output: $`
        function foo(aaa, bbb)
        {
              bar();
        }
      `,
      options: [2, { FunctionDeclaration: { body: 3 } }],
      errors: expectedErrors([3, 6, 0, 'Identifier']),
    },
    {
      code: $`
        function foo(
        aaa,
            bbb) {
        bar();
        }
      `,
      output: $`
        function foo(
          aaa,
          bbb) {
            bar();
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first', body: 2 } }],
      errors: expectedErrors([[2, 2, 0, 'Identifier'], [3, 2, 4, 'Identifier'], [4, 4, 0, 'Identifier']]),
    },
    {
      code: $`
        var foo = function(aaa,
          bbb,
            ccc,
              ddd) {
          bar();
        }
      `,
      output: $`
        var foo = function(aaa,
            bbb,
            ccc,
            ddd) {
        bar();
        }
      `,
      options: [2, { FunctionExpression: { parameters: 2, body: 0 } }],
      errors: expectedErrors([[2, 4, 2, 'Identifier'], [4, 4, 6, 'Identifier'], [5, 0, 2, 'Identifier']]),
    },
    {
      code: $`
        var foo = function(aaa,
           bbb,
         ccc) {
          bar();
        }
      `,
      output: $`
        var foo = function(aaa,
          bbb,
          ccc) {
                            bar();
        }
      `,
      options: [2, { FunctionExpression: { parameters: 1, body: 10 } }],
      errors: expectedErrors([[2, 2, 3, 'Identifier'], [3, 2, 1, 'Identifier'], [4, 20, 2, 'Identifier']]),
    },
    {
      code: $`
        var foo = function(aaa,
          bbb, ccc, ddd,
                                eee, fff) {
                bar();
        }
      `,
      output: $`
        var foo = function(aaa,
                           bbb, ccc, ddd,
                           eee, fff) {
            bar();
        }
      `,
      options: [4, { FunctionExpression: { parameters: 'first', body: 1 } }],
      errors: expectedErrors([[2, 19, 2, 'Identifier'], [3, 19, 24, 'Identifier'], [4, 4, 8, 'Identifier']]),
    },
    {
      code: $`
        var foo = function(
        aaa, bbb, ccc,
            ddd, eee) {
          bar();
        }
      `,
      output: $`
        var foo = function(
          aaa, bbb, ccc,
          ddd, eee) {
              bar();
        }
      `,
      options: [2, { FunctionExpression: { parameters: 'first', body: 3 } }],
      errors: expectedErrors([[2, 2, 0, 'Identifier'], [3, 2, 4, 'Identifier'], [4, 6, 2, 'Identifier']]),
    },
    {
      code: $`
        var foo = bar;
        \t\t\tvar baz = qux;
      `,
      output: $`
        var foo = bar;
        var baz = qux;
      `,
      options: [2],
      errors: expectedErrors([2, '0 spaces', '3 tabs', 'Keyword']),
    },
    {
      code: $`
        function foo() {
        \tbar();
          baz();
                      qux();
        }
      `,
      output: $`
        function foo() {
        \tbar();
        \tbaz();
        \tqux();
        }
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [[3, '1 tab', '2 spaces', 'Identifier'], [4, '1 tab', '14 spaces', 'Identifier']]),
    },
    {
      code: $`
        function foo() {
          bar();
        \t\t}
      `,
      output: $`
        function foo() {
          bar();
        }
      `,
      options: [2],
      errors: expectedErrors([[3, '0 spaces', '2 tabs', 'Punctuator']]),
    },
    {
      code: $`
        function foo() {
          function bar() {
                baz();
          }
        }
      `,
      output: $`
        function foo() {
          function bar() {
            baz();
          }
        }
      `,
      options: [2, { FunctionDeclaration: { body: 1 } }],
      errors: expectedErrors([3, 4, 8, 'Identifier']),
    },
    {
      code: $`
        function foo() {
          function bar(baz,
            qux) {
            foobar();
          }
        }
      `,
      output: $`
        function foo() {
          function bar(baz,
              qux) {
            foobar();
          }
        }
      `,
      options: [2, { FunctionDeclaration: { body: 1, parameters: 2 } }],
      errors: expectedErrors([3, 6, 4, 'Identifier']),
    },
    {
      code: $`
        function foo() {
          var bar = function(baz,
                  qux) {
            foobar();
          };
        }
      `,
      output: $`
        function foo() {
          var bar = function(baz,
                qux) {
            foobar();
          };
        }
      `,
      options: [2, { FunctionExpression: { parameters: 3 } }],
      errors: expectedErrors([3, 8, 10, 'Identifier']),
    },
    {
      code: $`
        foo.bar(
              baz, qux, function() {
                qux;
              }
        );
      `,
      output: $`
        foo.bar(
              baz, qux, function() {
                    qux;
              }
        );
      `,
      options: [2, { FunctionExpression: { body: 3 }, CallExpression: { arguments: 3 } }],
      errors: expectedErrors([3, 12, 8, 'Identifier']),
    },
    {
      code: $`
        {
            try {
            }
        catch (err) {
            }
        finally {
            }
        }
      `,
      output: $`
        {
            try {
            }
            catch (err) {
            }
            finally {
            }
        }
      `,
      errors: expectedErrors([
        [4, 4, 0, 'Keyword'],
        [6, 4, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        {
            do {
            }
        while (true)
        }
      `,
      output: $`
        {
            do {
            }
            while (true)
        }
      `,
      errors: expectedErrors([4, 4, 0, 'Keyword']),
    },
    {
      code: $`
        function foo() {
          return (
            1
            )
        }
      `,
      output: $`
        function foo() {
          return (
            1
          )
        }
      `,
      options: [2],
      errors: expectedErrors([[4, 2, 4, 'Punctuator']]),
    },
    {
      code: $`
        function foo() {
          return (
            1
            );
        }
      `,
      output: $`
        function foo() {
          return (
            1
          );
        }
      `,
      options: [2],
      errors: expectedErrors([[4, 2, 4, 'Punctuator']]),
    },
    {
      code: $`
        function test(){
          switch(length){
            case 1: return function(a){
            return fn.call(that, a);
            };
          }
        }
      `,
      output: $`
        function test(){
          switch(length){
            case 1: return function(a){
              return fn.call(that, a);
            };
          }
        }
      `,
      options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
      errors: expectedErrors([[4, 6, 4, 'Keyword']]),
    },
    {
      code: $`
        function foo() {
           return 1
        }
      `,
      output: $`
        function foo() {
          return 1
        }
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 3, 'Keyword']]),
    },
    {
      code: $`
        foo(
        bar,
          baz,
            qux);
      `,
      output: $`
        foo(
          bar,
          baz,
          qux);
      `,
      options: [2, { CallExpression: { arguments: 1 } }],
      errors: expectedErrors([[2, 2, 0, 'Identifier'], [4, 2, 4, 'Identifier']]),
    },
    {
      code: $`
        foo(
        \tbar,
        \tbaz);
      `,
      output: $`
        foo(
            bar,
            baz);
      `,
      options: [2, { CallExpression: { arguments: 2 } }],
      errors: expectedErrors([[2, '4 spaces', '1 tab', 'Identifier'], [3, '4 spaces', '1 tab', 'Identifier']]),
    },
    {
      code: $`
        foo(bar,
        \t\tbaz,
        \t\tqux);
      `,
      output: $`
        foo(bar,
        \tbaz,
        \tqux);
      `,
      options: ['tab', { CallExpression: { arguments: 1 } }],
      errors: expectedErrors('tab', [[2, 1, 2, 'Identifier'], [3, 1, 2, 'Identifier']]),
    },
    {
      code: $`
        foo(bar, baz,
                 qux);
      `,
      output: $`
        foo(bar, baz,
            qux);
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
      errors: expectedErrors([2, 4, 9, 'Identifier']),
    },
    {
      code: $`
        foo(
                  bar,
            baz);
      `,
      output: $`
        foo(
          bar,
          baz);
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
      errors: expectedErrors([[2, 2, 10, 'Identifier'], [3, 2, 4, 'Identifier']]),
    },
    {
      code: $`
        foo(bar,
          1 + 2,
                      !baz,
                new Car('!')
        );
      `,
      output: $`
        foo(bar,
              1 + 2,
              !baz,
              new Car('!')
        );
      `,
      options: [2, { CallExpression: { arguments: 3 } }],
      errors: expectedErrors([[2, 6, 2, 'Numeric'], [3, 6, 14, 'Punctuator'], [4, 6, 8, 'Keyword']]),
    },

    // https://github.com/eslint/eslint/issues/7573
    {
      code: $`
        return (
            foo
            );
      `,
      output: $`
        return (
            foo
        );
      `,
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        return (
            foo
            )
      `,
      output: $`
        return (
            foo
        )
      `,
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },

    // https://github.com/eslint/eslint/issues/7604
    {
      code: $`
        if (foo) {
                /* comment */bar();
        }
      `,
      output: $`
        if (foo) {
            /* comment */bar();
        }
      `,
      errors: expectedErrors([2, 4, 8, 'Block']),
    },
    {
      code: $`
        foo('bar',
                /** comment */{
                ok: true
            });
      `,
      output: $`
        foo('bar',
            /** comment */{
                ok: true
            });
      `,
      errors: expectedErrors([2, 4, 8, 'Block']),
    },
    {
      code: $`
        foo(
        (bar)
        );
      `,
      output: $`
        foo(
            (bar)
        );
      `,
      options: [4, { CallExpression: { arguments: 1 } }],
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        ((
        foo
        ))
      `,
      output: $`
        ((
            foo
        ))
      `,
      options: [4],
      errors: expectedErrors([2, 4, 0, 'Identifier']),
    },

    // ternary expressions (https://github.com/eslint/eslint/issues/7420)
    {
      code: $`
        foo
        ? bar
            : baz
      `,
      output: $`
        foo
          ? bar
          : baz
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 0, 'Punctuator'], [3, 2, 4, 'Punctuator']]),
    },
    {
      code: $`
        [
            foo ?
                bar :
                baz,
                qux
        ]
      `,
      output: $`
        [
            foo ?
                bar :
                baz,
            qux
        ]
      `,
      errors: expectedErrors([5, 4, 8, 'Identifier']),
    },
    {
      code: $`
        condition
        ? () => {
        return true
        }
        : condition2
        ? () => {
        return true
        }
        : () => {
        return false
        }
      `,
      output: $`
        condition
          ? () => {
              return true
            }
          : condition2
            ? () => {
                return true
              }
            : () => {
                return false
              }
      `,
      options: [2, { offsetTernaryExpressions: true }],
      errors: expectedErrors([
        [2, 2, 0, 'Punctuator'],
        [3, 6, 0, 'Keyword'],
        [4, 4, 0, 'Punctuator'],
        [5, 2, 0, 'Punctuator'],
        [6, 4, 0, 'Punctuator'],
        [7, 8, 0, 'Keyword'],
        [8, 6, 0, 'Punctuator'],
        [9, 4, 0, 'Punctuator'],
        [10, 8, 0, 'Keyword'],
        [11, 6, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        condition
        ? () => {
        return true
        }
        : condition2
        ? () => {
        return true
        }
        : () => {
        return false
        }
      `,
      output: $`
        condition
          ? () => {
            return true
          }
          : condition2
            ? () => {
              return true
            }
            : () => {
              return false
            }
      `,
      options: [2, { offsetTernaryExpressions: false }],
      errors: expectedErrors([
        [2, 2, 0, 'Punctuator'],
        [3, 4, 0, 'Keyword'],
        [4, 2, 0, 'Punctuator'],
        [5, 2, 0, 'Punctuator'],
        [6, 4, 0, 'Punctuator'],
        [7, 6, 0, 'Keyword'],
        [8, 4, 0, 'Punctuator'],
        [9, 4, 0, 'Punctuator'],
        [10, 6, 0, 'Keyword'],
        [11, 4, 0, 'Punctuator'],
      ]),
    },
    {

      /**
       *             Checking comments:
       * https://github.com/eslint/eslint/issues/6571
       */
      code: $`
        foo();
          // comment
            /* multiline
          comment */
        bar();
         // trailing comment
      `,
      output: $`
        foo();
        // comment
        /* multiline
          comment */
        bar();
        // trailing comment
      `,
      options: [2],
      errors: expectedErrors([[2, 0, 2, 'Line'], [3, 0, 4, 'Block'], [6, 0, 1, 'Line']]),
    },
    {
      code: '  // comment',
      output: '// comment',
      errors: expectedErrors([1, 0, 2, 'Line']),
    },
    {
      code: $`
        foo
          // comment
      `,
      output: $`
        foo
        // comment
      `,
      errors: expectedErrors([2, 0, 2, 'Line']),
    },
    {
      code: $`
          // comment
        foo
      `,
      output: $`
        // comment
        foo
      `,
      errors: expectedErrors([1, 0, 2, 'Line']),
    },
    {
      code: $`
        [
                // no elements
        ]
      `,
      output: $`
        [
            // no elements
        ]
      `,
      errors: expectedErrors([2, 4, 8, 'Line']),
    },
    {

      /**
       * Destructuring assignments:
       * https://github.com/eslint/eslint/issues/6813
       */
      code: $`
        var {
        foo,
          bar,
            baz: qux,
              foobar: baz = foobar
          } = qux;
      `,
      output: $`
        var {
          foo,
          bar,
          baz: qux,
          foobar: baz = foobar
        } = qux;
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 0, 'Identifier'], [4, 2, 4, 'Identifier'], [5, 2, 6, 'Identifier'], [6, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        const {
          a
        } = {
            a: 1
          }
      `,
      output: $`
        const {
          a
        } = {
          a: 1
        }
      `,
      options: [2],
      errors: expectedErrors([[4, 2, 4, 'Identifier'], [5, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        var foo = [
                   bar,
          baz
                  ]
      `,
      output: $`
        var foo = [
            bar,
            baz
        ]
      `,
      errors: expectedErrors([[2, 4, 11, 'Identifier'], [3, 4, 2, 'Identifier'], [4, 0, 10, 'Punctuator']]),
    },
    {
      code: $`
        var foo = [bar,
        baz,
            qux
        ]
      `,
      output: $`
        var foo = [bar,
            baz,
            qux
        ]
      `,
      errors: expectedErrors([2, 4, 0, 'Identifier']),
    },
    {
      code: $`
        var foo = [bar,
          baz,
          qux
        ]
      `,
      output: $`
        var foo = [bar,
        baz,
        qux
        ]
      `,
      options: [2, { ArrayExpression: 0 }],
      errors: expectedErrors([[2, 0, 2, 'Identifier'], [3, 0, 2, 'Identifier']]),
    },
    {
      code: $`
        var foo = [bar,
          baz,
          qux
        ]
      `,
      output: $`
        var foo = [bar,
                        baz,
                        qux
        ]
      `,
      options: [2, { ArrayExpression: 8 }],
      errors: expectedErrors([[2, 16, 2, 'Identifier'], [3, 16, 2, 'Identifier']]),
    },
    {
      code: $`
        var foo = [bar,
            baz,
            qux
        ]
      `,
      output: $`
        var foo = [bar,
                   baz,
                   qux
        ]
      `,
      options: [2, { ArrayExpression: 'first' }],
      errors: expectedErrors([[2, 11, 4, 'Identifier'], [3, 11, 4, 'Identifier']]),
    },
    {
      code: $`
        var foo = [bar,
            baz, qux
        ]
      `,
      output: $`
        var foo = [bar,
                   baz, qux
        ]
      `,
      options: [2, { ArrayExpression: 'first' }],
      errors: expectedErrors([2, 11, 4, 'Identifier']),
    },
    {
      code: $`
        var foo = [
                { bar: 1,
                    baz: 2 },
                { bar: 3,
                    qux: 4 }
        ]
      `,
      output: $`
        var foo = [
                { bar: 1,
                  baz: 2 },
                { bar: 3,
                  qux: 4 }
        ]
      `,
      options: [4, { ArrayExpression: 2, ObjectExpression: 'first' }],
      errors: expectedErrors([[3, 10, 12, 'Identifier'], [5, 10, 12, 'Identifier']]),
    },
    {
      code: $`
        var foo = {
          bar: 1,
          baz: 2
        };
      `,
      output: $`
        var foo = {
        bar: 1,
        baz: 2
        };
      `,
      options: [2, { ObjectExpression: 0 }],
      errors: expectedErrors([[2, 0, 2, 'Identifier'], [3, 0, 2, 'Identifier']]),
    },
    {
      code: $`
        var quux = { foo: 1, bar: 2,
        baz: 3 }
      `,
      output: $`
        var quux = { foo: 1, bar: 2,
                     baz: 3 }
      `,
      options: [2, { ObjectExpression: 'first' }],
      errors: expectedErrors([2, 13, 0, 'Identifier']),
    },
    {
      code: $`
        function foo() {
            [
                    foo
            ]
        }
      `,
      output: $`
        function foo() {
          [
                  foo
          ]
        }
      `,
      options: [2, { ArrayExpression: 4 }],
      errors: expectedErrors([[2, 2, 4, 'Punctuator'], [3, 10, 12, 'Identifier'], [4, 2, 4, 'Punctuator']]),
    },
    {
      code: $`
        var [
        foo,
          bar,
            baz,
              foobar = baz
          ] = qux;
      `,
      output: $`
        var [
          foo,
          bar,
          baz,
          foobar = baz
        ] = qux;
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 0, 'Identifier'], [4, 2, 4, 'Identifier'], [5, 2, 6, 'Identifier'], [6, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        import {
        foo,
          bar,
            baz
        } from 'qux';
      `,
      output: $`
        import {
            foo,
            bar,
            baz
        } from 'qux';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([[2, 4, 0, 'Identifier'], [3, 4, 2, 'Identifier']]),
    },
    {
      code: $`
        import { foo,
                 bar,
                  baz,
        } from 'qux';
      `,
      output: $`
        import { foo,
                 bar,
                 baz,
        } from 'qux';
      `,
      options: [4, { ImportDeclaration: 'first' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([[3, 9, 10, 'Identifier']]),
    },
    {
      code: $`
        import { foo,
            bar,
             baz,
        } from 'qux';
      `,
      output: $`
        import { foo,
            bar,
            baz,
        } from 'qux';
      `,
      options: [2, { ImportDeclaration: 2 }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([[3, 4, 5, 'Identifier']]),
    },
    {
      code: $`
        var foo = 0, bar = 0, baz = 0;
        export {
        foo,
          bar,
            baz
        };
      `,
      output: $`
        var foo = 0, bar = 0, baz = 0;
        export {
            foo,
            bar,
            baz
        };
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([[3, 4, 0, 'Identifier'], [4, 4, 2, 'Identifier']]),
    },
    {
      code: $`
        var foo = 0, bar = 0, baz = 0;
        export {
        foo,
          bar,
            baz
        } from 'qux';
      `,
      output: $`
        var foo = 0, bar = 0, baz = 0;
        export {
            foo,
            bar,
            baz
        } from 'qux';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([[3, 4, 0, 'Identifier'], [4, 4, 2, 'Identifier']]),
    },
    {

      // https://github.com/eslint/eslint/issues/7233
      code: $`
        var folder = filePath
          .foo()
              .bar;
      `,
      output: $`
        var folder = filePath
            .foo()
            .bar;
      `,
      options: [2, { MemberExpression: 2 }],
      errors: expectedErrors([[2, 4, 2, 'Punctuator'], [3, 4, 6, 'Punctuator']]),
    },
    {
      code: $`
        for (const foo of bar)
            baz();
      `,
      output: $`
        for (const foo of bar)
          baz();
      `,
      options: [2],
      errors: expectedErrors([2, 2, 4, 'Identifier']),
    },
    {
      code: $`
        var x = () =>
            5;
      `,
      output: $`
        var x = () =>
          5;
      `,
      options: [2],
      errors: expectedErrors([2, 2, 4, 'Numeric']),
    },
    {

      // BinaryExpressions with parens
      code: $`
        foo && (
                bar
        )
      `,
      output: $`
        foo && (
            bar
        )
      `,
      options: [4],
      errors: expectedErrors([2, 4, 8, 'Identifier']),
    },
    {
      code: $`
        foo &&
            !bar(
        )
      `,
      output: $`
        foo &&
            !bar(
            )
      `,
      errors: expectedErrors([3, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        foo &&
            ![].map(() => {
            bar();
        })
      `,
      output: $`
        foo &&
            ![].map(() => {
                bar();
            })
      `,
      errors: expectedErrors([[3, 8, 4, 'Identifier'], [4, 4, 0, 'Punctuator']]),
    },
    {
      code: $`
        [
        ] || [
            ]
      `,
      output: $`
        [
        ] || [
        ]
      `,
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        foo
                || (
                        bar
                    )
      `,
      output: $`
        foo
                || (
                    bar
                )
      `,
      errors: expectedErrors([[3, 12, 16, 'Identifier'], [4, 8, 12, 'Punctuator']]),
    },
    {
      code: $`
        1
        + (
                1
            )
      `,
      output: $`
        1
        + (
            1
        )
      `,
      errors: expectedErrors([[3, 4, 8, 'Numeric'], [4, 0, 4, 'Punctuator']]),
    },

    // Template curlies
    {
      code: $`
        \`foo\${
        bar}\`
      `,
      output: $`
        \`foo\${
          bar}\`
      `,
      options: [2],
      errors: expectedErrors([2, 2, 0, 'Identifier']),
    },
    {
      code: $`
        \`foo\${
            \`bar\${
        baz}\`}\`
      `,
      output: $`
        \`foo\${
          \`bar\${
            baz}\`}\`
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 4, 'Template'], [3, 4, 0, 'Identifier']]),
    },
    {
      code: $`
        \`foo\${
            \`bar\${
          baz
            }\`
          }\`
      `,
      output: $`
        \`foo\${
          \`bar\${
            baz
          }\`
        }\`
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 4, 'Template'], [3, 4, 2, 'Identifier'], [4, 2, 4, 'Template'], [5, 0, 2, 'Template']]),
    },
    {
      code: $`
        \`foo\${
        (
          bar
        )
        }\`
      `,
      output: $`
        \`foo\${
          (
            bar
          )
        }\`
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 0, 'Punctuator'], [3, 4, 2, 'Identifier'], [4, 2, 0, 'Punctuator']]),
    },
    {
      code: $`
        function foo() {
            \`foo\${bar}baz\${
        qux}foo\${
          bar}baz\`
        }
      `,
      output: $`
        function foo() {
            \`foo\${bar}baz\${
                qux}foo\${
                bar}baz\`
        }
      `,
      errors: expectedErrors([[3, 8, 0, 'Identifier'], [4, 8, 2, 'Identifier']]),
    },
    {
      code: $`
        function foo() {
            const template = \`the indentation of
        a curly element in a \${
                node.type
            } node is checked.\`;
        }
      `,
      output: $`
        function foo() {
            const template = \`the indentation of
        a curly element in a \${
            node.type
        } node is checked.\`;
        }
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Template']]),
    },
    {
      code: $`
        function foo() {
            const template = \`this time the
        closing curly is at the end of the line \${
                    foo}
                so the spaces before this line aren't removed.\`;
        }
      `,
      output: $`
        function foo() {
            const template = \`this time the
        closing curly is at the end of the line \${
            foo}
                so the spaces before this line aren't removed.\`;
        }
      `,
      errors: expectedErrors([4, 4, 12, 'Identifier']),
    },
    {

      /**
       *             https://github.com/eslint/eslint/issues/1801
       * Note: This issue also mentioned checking the indentation for the 2 below. However,
       * this is intentionally ignored because everyone seems to have a different idea of how
       * BinaryExpressions should be indented.
       */
      code: $`
        if (true) {
            a = (
        1 +
                2);
        }
      `,
      output: $`
        if (true) {
            a = (
                1 +
                2);
        }
      `,
      errors: expectedErrors([3, 8, 0, 'Numeric']),
    },
    {

      // https://github.com/eslint/eslint/issues/3737
      code: $`
        if (true) {
            for (;;) {
              b();
          }
        }
      `,
      output: $`
        if (true) {
          for (;;) {
            b();
          }
        }
      `,
      options: [2],
      errors: expectedErrors([[2, 2, 4, 'Keyword'], [3, 4, 6, 'Identifier']]),
    },
    {

      // https://github.com/eslint/eslint/issues/6670
      code: $`
        function f() {
            return asyncCall()
            .then(
                       'some string',
                      [
                      1,
                 2,
                                           3
                              ]
        );
         }
      `,
      output: $`
        function f() {
            return asyncCall()
                .then(
                    'some string',
                    [
                        1,
                        2,
                        3
                    ]
                );
        }
      `,
      options: [4, { MemberExpression: 1, CallExpression: { arguments: 1 } }],
      errors: expectedErrors([
        [3, 8, 4, 'Punctuator'],
        [4, 12, 15, 'String'],
        [5, 12, 14, 'Punctuator'],
        [6, 16, 14, 'Numeric'],
        [7, 16, 9, 'Numeric'],
        [8, 16, 35, 'Numeric'],
        [9, 12, 22, 'Punctuator'],
        [10, 8, 0, 'Punctuator'],
        [11, 0, 1, 'Punctuator'],
      ]),
    },

    // https://github.com/eslint/eslint/issues/7242
    {
      code: $`
        var x = [
              [1],
          [2]
        ]
      `,
      output: $`
        var x = [
            [1],
            [2]
        ]
      `,
      errors: expectedErrors([[2, 4, 6, 'Punctuator'], [3, 4, 2, 'Punctuator']]),
    },
    {
      code: $`
        var y = [
              {a: 1},
          {b: 2}
        ]
      `,
      output: $`
        var y = [
            {a: 1},
            {b: 2}
        ]
      `,
      errors: expectedErrors([[2, 4, 6, 'Punctuator'], [3, 4, 2, 'Punctuator']]),
    },
    {
      code: $`
        echo = spawn('cmd.exe',
                    ['foo', 'bar',
                     'baz']);
      `,
      output: $`
        echo = spawn('cmd.exe',
                     ['foo', 'bar',
                      'baz']);
      `,
      options: [2, { ArrayExpression: 'first', CallExpression: { arguments: 'first' } }],
      errors: expectedErrors([[2, 13, 12, 'Punctuator'], [3, 14, 13, 'String']]),
    },
    {

      // https://github.com/eslint/eslint/issues/7522
      code: $`
        foo(
          )
      `,
      output: $`
        foo(
        )
      `,
      errors: expectedErrors([2, 0, 2, 'Punctuator']),
    },
    {

      // https://github.com/eslint/eslint/issues/7616
      code: $`
        foo(
                bar,
            {
                baz: 1
            }
        )
      `,
      output: $`
        foo(
            bar,
            {
                baz: 1
            }
        )
      `,
      options: [4, { CallExpression: { arguments: 'first' } }],
      errors: expectedErrors([[2, 4, 8, 'Identifier']]),
    },
    {
      code: '  new Foo',
      output: 'new Foo',
      errors: expectedErrors([1, 0, 2, 'Keyword']),
    },
    {
      code: $`
        var foo = 0, bar = 0, baz = 0;
        export {
        foo,
                bar,
          baz
        }
      `,
      output: $`
        var foo = 0, bar = 0, baz = 0;
        export {
            foo,
            bar,
            baz
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([[3, 4, 0, 'Identifier'], [4, 4, 8, 'Identifier'], [5, 4, 2, 'Identifier']]),
    },
    {
      code: $`
        foo
            ? bar
        : baz
      `,
      output: $`
        foo
            ? bar
            : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([3, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        foo ?
            bar :
        baz
      `,
      output: $`
        foo ?
            bar :
            baz
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([3, 4, 0, 'Identifier']),
    },
    {
      code: $`
        foo ?
            bar
          : baz
      `,
      output: $`
        foo ?
            bar
            : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([3, 4, 2, 'Punctuator']),
    },
    {
      code: $`
        foo
            ? bar :
        baz
      `,
      output: $`
        foo
            ? bar :
            baz
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([3, 4, 0, 'Identifier']),
    },
    {
      code: $`
        foo ? bar
            : baz ? qux
                : foobar ? boop
                    : beep
      `,
      output: $`
        foo ? bar
            : baz ? qux
            : foobar ? boop
            : beep
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([
        [3, 4, 8, 'Punctuator'],
        [4, 4, 12, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo ? bar :
            baz ? qux :
                foobar ? boop :
                    beep
      `,
      output: $`
        foo ? bar :
            baz ? qux :
            foobar ? boop :
            beep
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([
        [3, 4, 8, 'Identifier'],
        [4, 4, 12, 'Identifier'],
      ]),
    },
    {
      code: $`
        var a =
            foo ? bar :
              baz ? qux :
          foobar ? boop :
            /*else*/ beep
      `,
      output: $`
        var a =
            foo ? bar :
            baz ? qux :
            foobar ? boop :
            /*else*/ beep
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([
        [3, 4, 6, 'Identifier'],
        [4, 4, 2, 'Identifier'],
      ]),
    },
    {
      code: $`
        var a =
            foo
            ? bar
            : baz
      `,
      output: $`
        var a =
            foo
                ? bar
                : baz
      `,
      options: [4, { flatTernaryExpressions: true }],
      errors: expectedErrors([
        [3, 8, 4, 'Punctuator'],
        [4, 8, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo ? bar
            : baz ? qux
            : foobar ? boop
            : beep
      `,
      output: $`
        foo ? bar
            : baz ? qux
                : foobar ? boop
                    : beep
      `,
      options: [4, { flatTernaryExpressions: false }],
      errors: expectedErrors([
        [3, 8, 4, 'Punctuator'],
        [4, 12, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo ? bar :
            baz ? qux :
            foobar ? boop :
            beep
      `,
      output: $`
        foo ? bar :
            baz ? qux :
                foobar ? boop :
                    beep
      `,
      options: [4, { flatTernaryExpressions: false }],
      errors: expectedErrors([
        [3, 8, 4, 'Identifier'],
        [4, 12, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        foo
            ? bar
            : baz
            ? qux
            : foobar
            ? boop
            : beep
      `,
      output: $`
        foo
            ? bar
            : baz
                ? qux
                : foobar
                    ? boop
                    : beep
      `,
      options: [4, { flatTernaryExpressions: false }],
      errors: expectedErrors([
        [4, 8, 4, 'Punctuator'],
        [5, 8, 4, 'Punctuator'],
        [6, 12, 4, 'Punctuator'],
        [7, 12, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo ?
            bar :
            baz ?
            qux :
            foobar ?
            boop :
            beep
      `,
      output: $`
        foo ?
            bar :
            baz ?
                qux :
                foobar ?
                    boop :
                    beep
      `,
      options: [4, { flatTernaryExpressions: false }],
      errors: expectedErrors([
        [4, 8, 4, 'Identifier'],
        [5, 8, 4, 'Identifier'],
        [6, 12, 4, 'Identifier'],
        [7, 12, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        foo.bar('baz', function(err) {
                  qux;
        });
      `,
      output: $`
        foo.bar('baz', function(err) {
          qux;
        });
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
      errors: expectedErrors([2, 2, 10, 'Identifier']),
    },
    {
      code: $`
        foo.bar(function() {
          cookies;
        }).baz(function() {
            cookies;
          });
      `,
      output: $`
        foo.bar(function() {
          cookies;
        }).baz(function() {
          cookies;
        });
      `,
      options: [2, { MemberExpression: 1 }],
      errors: expectedErrors([[4, 2, 4, 'Identifier'], [5, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        foo.bar().baz(function() {
          cookies;
        }).qux(function() {
            cookies;
          });
      `,
      output: $`
        foo.bar().baz(function() {
          cookies;
        }).qux(function() {
          cookies;
        });
      `,
      options: [2, { MemberExpression: 1 }],
      errors: expectedErrors([[4, 2, 4, 'Identifier'], [5, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        [ foo,
          bar ].forEach(function() {
            baz;
          })
      `,
      output: $`
        [ foo,
          bar ].forEach(function() {
          baz;
        })
      `,
      options: [2, { ArrayExpression: 'first', MemberExpression: 1 }],
      errors: expectedErrors([[3, 2, 4, 'Identifier'], [4, 0, 2, 'Punctuator']]),
    },
    {
      code: $`
        foo[
            bar
            ];
      `,
      output: $`
        foo[
            bar
        ];
      `,
      options: [4, { MemberExpression: 1 }],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        foo({
        bar: 1,
        baz: 2
        })
      `,
      output: $`
        foo({
            bar: 1,
            baz: 2
        })
      `,
      options: [4, { ObjectExpression: 'first' }],
      errors: expectedErrors([[2, 4, 0, 'Identifier'], [3, 4, 0, 'Identifier']]),
    },
    {
      code: $`
        foo(
                                bar, baz,
                                qux);
      `,
      output: $`
        foo(
          bar, baz,
          qux);
      `,
      options: [2, { CallExpression: { arguments: 'first' } }],
      errors: expectedErrors([[2, 2, 24, 'Identifier'], [3, 2, 24, 'Identifier']]),
    },
    {
      code: $`
        if (foo) bar()
        
            ; [1, 2, 3].map(baz)
      `,
      output: $`
        if (foo) bar()
        
        ; [1, 2, 3].map(baz)
      `,
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
        ;
      `,
      output: $`
        if (foo)
            ;
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        import {foo}
        from 'bar';
      `,
      output: $`
        import {foo}
            from 'bar';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([2, 4, 0, 'Identifier']),
    },
    {
      code: $`
        export {foo}
        from 'bar';
      `,
      output: $`
        export {foo}
            from 'bar';
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedErrors([2, 4, 0, 'Identifier']),
    },
    {
      code: $`
        (
            a
        ) => b => {
                c
            }
      `,
      output: $`
        (
            a
        ) => b => {
            c
        }
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        (
            a
        ) => b => c => d => {
                e
            }
      `,
      output: $`
        (
            a
        ) => b => c => d => {
            e
        }
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        if (
            foo
        ) bar(
                baz
            );
      `,
      output: $`
        if (
            foo
        ) bar(
            baz
        );
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        (
            foo
        )(
                bar
            )
      `,
      output: $`
        (
            foo
        )(
            bar
        )
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        (() =>
            foo
        )(
                bar
            )
      `,
      output: $`
        (() =>
            foo
        )(
            bar
        )
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        (() => {
            foo();
        })(
                bar
            )
      `,
      output: $`
        (() => {
            foo();
        })(
            bar
        )
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        foo.
          bar.
              baz
      `,
      output: $`
        foo.
            bar.
            baz
      `,
      errors: expectedErrors([[2, 4, 2, 'Identifier'], [3, 4, 6, 'Identifier']]),
    },
    {
      code: $`
        const foo = a.b(),
            longName
            = (baz(
                    'bar',
                    'bar'
                ));
      `,
      output: $`
        const foo = a.b(),
            longName
            = (baz(
                'bar',
                'bar'
            ));
      `,
      errors: expectedErrors([[4, 8, 12, 'String'], [5, 8, 12, 'String'], [6, 4, 8, 'Punctuator']]),
    },
    {
      code: $`
        const foo = a.b(),
            longName =
            (baz(
                    'bar',
                    'bar'
                ));
      `,
      output: $`
        const foo = a.b(),
            longName =
            (baz(
                'bar',
                'bar'
            ));
      `,
      errors: expectedErrors([[4, 8, 12, 'String'], [5, 8, 12, 'String'], [6, 4, 8, 'Punctuator']]),
    },
    {
      code: $`
        const foo = a.b(),
            longName
                =baz(
                    'bar',
                    'bar'
            );
      `,
      output: $`
        const foo = a.b(),
            longName
                =baz(
                    'bar',
                    'bar'
                );
      `,
      errors: expectedErrors([[6, 8, 4, 'Punctuator']]),
    },
    {
      code: $`
        const foo = a.b(),
            longName
                =(
                'fff'
                );
      `,
      output: $`
        const foo = a.b(),
            longName
                =(
                    'fff'
                );
      `,
      errors: expectedErrors([[4, 12, 8, 'String']]),
    },

    // ----------------------------------------------------------------------
    // Ignore Unknown Nodes
    // ----------------------------------------------------------------------

    {
      code: $`
        namespace Foo {
            const bar = 3,
            baz = 2;
        
            if (true) {
            const bax = 3;
            }
        }
      `,
      output: $`
        namespace Foo {
            const bar = 3,
                baz = 2;
        
            if (true) {
                const bax = 3;
            }
        }
      `,
      parser: tsParser,
      errors: expectedErrors([[3, 8, 4, 'Identifier'], [6, 8, 4, 'Keyword']]),
    },
    {
      code: $`
        abstract class Foo {
            public bar() {
                let aaa = 4,
                boo;
        
                if (true) {
                boo = 3;
                }
        
            boo = 3 + 2;
            }
        }
      `,
      output: $`
        abstract class Foo {
            public bar() {
                let aaa = 4,
                    boo;
        
                if (true) {
                    boo = 3;
                }
        
                boo = 3 + 2;
            }
        }
      `,
      parser: tsParser,
      errors: expectedErrors([[4, 12, 8, 'Identifier'], [7, 12, 8, 'Identifier'], [10, 8, 4, 'Identifier']]),
    },
    {
      code: $`
        function foo() {
            function bar() {
                abstract class X {
                public baz() {
                if (true) {
                qux();
                }
                }
                }
            }
        }
      `,
      output: $`
        function foo() {
            function bar() {
                abstract class X {
                    public baz() {
                        if (true) {
                            qux();
                        }
                    }
                }
            }
        }
      `,
      parser: tsParser,
      errors: expectedErrors([
        [4, 12, 8, 'Keyword'],
        [5, 16, 8, 'Keyword'],
        [6, 20, 8, 'Identifier'],
        [7, 16, 8, 'Punctuator'],
        [8, 12, 8, 'Punctuator'],
      ]),
    },
    {
      code: $`
        namespace Unknown {
            function foo() {
            function bar() {
                    abstract class X {
                        public baz() {
                            if (true) {
                            qux();
                            }
                        }
                    }
                }
            }
        }
      `,
      output: $`
        namespace Unknown {
            function foo() {
                function bar() {
                    abstract class X {
                        public baz() {
                            if (true) {
                                qux();
                            }
                        }
                    }
                }
            }
        }
      `,
      parser: tsParser,
      errors: expectedErrors([
        [3, 8, 4, 'Keyword'],
        [7, 24, 20, 'Identifier'],
      ]),
    },

    // ----------------------------------------------------------------------
    // JSX tests
    // Some of the following tests are adapted from the tests in eslint-plugin-react.
    // License: https://github.com/yannickcr/eslint-plugin-react/blob/7ca9841f22d599f447a27ef5b2a97def9229d6c8/LICENSE
    // ----------------------------------------------------------------------

    {
      code: $`
        <App>
          <Foo />
        </App>
      `,
      output: $`
        <App>
            <Foo />
        </App>
      `,
      errors: expectedErrors([2, 4, 2, 'Punctuator']),
    },
    {
      code: $`
        <App>
            <Foo />
        </App>
      `,
      output: $`
        <App>
          <Foo />
        </App>
      `,
      options: [2],
      errors: expectedErrors([2, 2, 4, 'Punctuator']),
    },
    {
      code: $`
        <App>
            <Foo />
        </App>
      `,
      output: $`
        <App>
        \t<Foo />
        </App>
      `,
      options: ['tab'],
      errors: expectedErrors([2, '1 tab', '4 spaces', 'Punctuator']),
    },
    {
      code: $`
        function App() {
          return <App>
            <Foo />
                 </App>;
        }
      `,
      output: $`
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
      errors: expectedErrors([4, 2, 9, 'Punctuator']),
    },
    {
      code: $`
        function App() {
          return (<App>
            <Foo />
            </App>);
        }
      `,
      output: $`
        function App() {
          return (<App>
            <Foo />
          </App>);
        }
      `,
      options: [2],
      errors: expectedErrors([4, 2, 4, 'Punctuator']),
    },
    {
      code: $`
        function App() {
          return (
        <App>
          <Foo />
        </App>
          );
        }
      `,
      output: $`
        function App() {
          return (
            <App>
              <Foo />
            </App>
          );
        }
      `,
      options: [2],
      errors: expectedErrors([[3, 4, 0, 'Punctuator'], [4, 6, 2, 'Punctuator'], [5, 4, 0, 'Punctuator']]),
    },
    {
      code: $`
        <App>
         {test}
        </App>
      `,
      output: $`
        <App>
            {test}
        </App>
      `,
      errors: expectedErrors([2, 4, 1, 'Punctuator']),
    },
    {
      code: $`
        <App>
            {options.map((option, index) => (
                <option key={index} value={option.key}>
                   {option.name}
                </option>
            ))}
        </App>
      `,
      output: $`
        <App>
            {options.map((option, index) => (
                <option key={index} value={option.key}>
                    {option.name}
                </option>
            ))}
        </App>
      `,
      errors: expectedErrors([4, 12, 11, 'Punctuator']),
    },
    {
      code: $`
        [
          <div />,
            <div />
        ]
      `,
      output: $`
        [
          <div />,
          <div />
        ]
      `,
      options: [2],
      errors: expectedErrors([3, 2, 4, 'Punctuator']),
    },
    {
      code: $`
        <App>
        
         <Foo />
        
        </App>
      `,
      output: $`
        <App>
        
        \t<Foo />
        
        </App>
      `,
      options: ['tab'],
      errors: expectedErrors([3, '1 tab', '1 space', 'Punctuator']),
    },
    {

      /**
       *             Multiline ternary
       * (colon at the end of the first expression)
       */
      code: $`
        foo ?
            <Foo /> :
        <Bar />
      `,
      output: $`
        foo ?
            <Foo /> :
            <Bar />
      `,
      errors: expectedErrors([3, 4, 0, 'Punctuator']),
    },
    {

      /**
       *             Multiline ternary
       * (colon on its own line)
       */
      code: $`
        foo ?
            <Foo />
        :
        <Bar />
      `,
      output: $`
        foo ?
            <Foo />
            :
            <Bar />
      `,
      errors: expectedErrors([[3, 4, 0, 'Punctuator'], [4, 4, 0, 'Punctuator']]),
    },
    {

      /**
       *             Multiline ternary
       * (colon at the end of the first expression, parenthesized first expression)
       */
      code: $`
        foo ? (
            <Foo />
        ) :
        <Bar />
      `,
      output: $`
        foo ? (
            <Foo />
        ) :
            <Bar />
      `,
      errors: expectedErrors([4, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        <App
          foo
        />
      `,
      output: $`
        <App
            foo
        />
      `,
      errors: expectedErrors([2, 4, 2, 'JSXIdentifier']),
    },
    {
      code: $`
        <App
          foo
          />
      `,
      output: $`
        <App
          foo
        />
      `,
      options: [2],
      errors: expectedErrors([3, 0, 2, 'Punctuator']),
    },
    {
      code: $`
        <App
          foo
          ></App>
      `,
      output: $`
        <App
          foo
        ></App>
      `,
      options: [2],
      errors: expectedErrors([3, 0, 2, 'Punctuator']),
    },
    {
      code: $`
        const Button = function(props) {
          return (
            <Button
              size={size}
              onClick={onClick}
                                            >
                                              Button Text
            </Button>
          );
        };
      `,
      output: $`
        const Button = function(props) {
          return (
            <Button
              size={size}
              onClick={onClick}
            >
              Button Text
            </Button>
          );
        };
      `,
      options: [2],
      errors: expectedErrors([
        [6, 4, 36, 'Punctuator'],
        [6, 6, 38, 'JSXText'],
      ]),
    },
    {
      code: $`
        var x = function() {
          return <App
            foo
                 />
        }
      `,
      output: $`
        var x = function() {
          return <App
            foo
          />
        }
      `,
      options: [2],
      errors: expectedErrors([4, 2, 9, 'Punctuator']),
    },
    {
      code: $`
        var x = <App
          foo
                />
      `,
      output: $`
        var x = <App
          foo
        />
      `,
      options: [2],
      errors: expectedErrors([3, 0, 8, 'Punctuator']),
    },
    {
      code: $`
        var x = (
          <Something
            />
        )
      `,
      output: $`
        var x = (
          <Something
          />
        )
      `,
      options: [2],
      errors: expectedErrors([3, 2, 4, 'Punctuator']),
    },
    {
      code: $`
        <App
        \tfoo
        \t/>
      `,
      output: $`
        <App
        \tfoo
        />
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [3, 0, 1, 'Punctuator']),
    },
    {
      code: $`
        <App
        \tfoo
        \t></App>
      `,
      output: $`
        <App
        \tfoo
        ></App>
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [3, 0, 1, 'Punctuator']),
    },
    {
      code: $`
        <
            foo
            .bar
            .baz
        >
            foo
        </
            foo.
            bar.
            baz
        >
      `,
      output: $`
        <
            foo
                .bar
                .baz
        >
            foo
        </
            foo.
                bar.
                baz
        >
      `,
      errors: expectedErrors([
        [3, 8, 4, 'Punctuator'],
        [4, 8, 4, 'Punctuator'],
        [9, 8, 4, 'JSXIdentifier'],
        [10, 8, 4, 'JSXIdentifier'],
      ]),
    },
    {
      code: $`
        <
            input
            type=
            "number"
        />
      `,
      output: $`
        <
            input
            type=
                "number"
        />
      `,
      errors: expectedErrors([4, 8, 4, 'JSXText']),
    },
    {
      code: $`
        <
            input
            type=
            {'number'}
        />
      `,
      output: $`
        <
            input
            type=
                {'number'}
        />
      `,
      errors: expectedErrors([4, 8, 4, 'Punctuator']),
    },
    {
      code: $`
        <
            input
            type
            ="number"
        />
      `,
      output: $`
        <
            input
            type
                ="number"
        />
      `,
      errors: expectedErrors([4, 8, 4, 'Punctuator']),
    },
    {
      code: $`
        foo ? (
            bar
        ) : (
                baz
            )
      `,
      output: $`
        foo ? (
            bar
        ) : (
            baz
        )
      `,
      errors: expectedErrors([[4, 4, 8, 'Identifier'], [5, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        foo ? (
            <div>
            </div>
        ) : (
                <span>
                </span>
            )
      `,
      output: $`
        foo ? (
            <div>
            </div>
        ) : (
            <span>
            </span>
        )
      `,
      errors: expectedErrors([[5, 4, 8, 'Punctuator'], [6, 4, 8, 'Punctuator'], [7, 0, 4, 'Punctuator']]),
    },
    {
      code: $`
        <div>
            {
            (
                1
            )
            }
        </div>
      `,
      output: $`
        <div>
            {
                (
                    1
                )
            }
        </div>
      `,
      errors: expectedErrors([[3, 8, 4, 'Punctuator'], [4, 12, 8, 'Numeric'], [5, 8, 4, 'Punctuator']]),
    },
    {
      code: $`
        <div>
            {
              /* foo */
            }
        </div>
      `,
      output: $`
        <div>
            {
                /* foo */
            }
        </div>
      `,
      errors: expectedErrors([3, 8, 6, 'Block']),
    },
    {
      code: $`
        <div
        {...props}
        />
      `,
      output: $`
        <div
            {...props}
        />
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        <div
            {
              ...props
            }
        />
      `,
      output: $`
        <div
            {
                ...props
            }
        />
      `,
      errors: expectedErrors([3, 8, 6, 'Punctuator']),
    },
    {
      code: $`
        <div>foo
        <div>bar</div>
        </div>
      `,
      output: $`
        <div>foo
            <div>bar</div>
        </div>
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        <small>Foo bar&nbsp;
        <a>baz qux</a>.
        </small>
      `,
      output: $`
        <small>Foo bar&nbsp;
            <a>baz qux</a>.
        </small>
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },

    /**
     *         JSX Fragments
     * https://github.com/eslint/eslint/issues/12208
     */
    {
      code: $`
        <>
        <A />
        </>
      `,
      output: $`
        <>
            <A />
        </>
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        <
            >
            <A />
        </>
      `,
      output: $`
        <
        >
            <A />
        </>
      `,
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <>
            <A />
        <
            />
      `,
      output: $`
        <>
            <A />
        <
        />
      `,
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <>
            <A />
        </
            >
      `,
      output: $`
        <>
            <A />
        </
        >
      `,
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <
            >
            <A />
        </
            >
      `,
      output: $`
        <
        >
            <A />
        </
        >
      `,
      errors: expectedErrors([
        [2, 0, 4, 'Punctuator'],
        [5, 0, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        <
            >
            <A />
        <
            />
      `,
      output: $`
        <
        >
            <A />
        <
        />
      `,
      errors: expectedErrors([
        [2, 0, 4, 'Punctuator'],
        [5, 0, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        < // Comment
            >
            <A />
        </>
      `,
      output: $`
        < // Comment
        >
            <A />
        </>
      `,
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <>
            <A />
        < // Comment
            />
      `,
      output: $`
        <>
            <A />
        < // Comment
        />
      `,
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <>
            <A />
        </ // Comment
            >
      `,
      output: $`
        <>
            <A />
        </ // Comment
        >
      `,
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        < /* Comment */
            >
            <A />
        </>
      `,
      output: $`
        < /* Comment */
        >
            <A />
        </>
      `,
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <>
            <A />
        < /* Comment */
            />
      `,
      output: $`
        <>
            <A />
        < /* Comment */
        />
      `,
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        <>
            <A />
        </ /* Comment */
            >
      `,
      output: $`
        <>
            <A />
        </ /* Comment */
        >
      `,
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },

    {
      code: $`
        ({
            foo
            }: bar) => baz
      `,
      output: $`
        ({
            foo
        }: bar) => baz
      `,
      parser: parser('babel-eslint7/object-pattern-with-annotation'),
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        ([
            foo
            ]: bar) => baz
      `,
      output: $`
        ([
            foo
        ]: bar) => baz
      `,
      parser: parser('babel-eslint7/array-pattern-with-annotation'),
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        ({
            foo
            }: {}) => baz
      `,
      output: $`
        ({
            foo
        }: {}) => baz
      `,
      parser: parser('babel-eslint7/object-pattern-with-object-annotation'),
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        class Foo {
        foo() {
        bar();
        }
        }
      `,
      output: $`
        class Foo {
        foo() {
            bar();
        }
        }
      `,
      options: [4, { ignoredNodes: ['ClassBody'] }],
      errors: expectedErrors([3, 4, 0, 'Identifier']),
    },
    {
      code: $`
        $(function() {
        
        foo();
        bar();
        
        foo(function() {
        baz();
        });
        
        });
      `,
      output: $`
        $(function() {
        
        foo();
        bar();
        
        foo(function() {
            baz();
        });
        
        });
      `,
      options: [4, {
        ignoredNodes: ['ExpressionStatement > CallExpression[callee.name=\'$\'] > FunctionExpression > BlockStatement'],
      }],
      errors: expectedErrors([7, 4, 0, 'Identifier']),
    },
    {
      code: $`
        (function($) {
        $(function() {
        foo;
        });
        })()
      `,
      output: $`
        (function($) {
        $(function() {
            foo;
        });
        })()
      `,
      options: [4, {
        ignoredNodes: ['ExpressionStatement > CallExpression > FunctionExpression.callee > BlockStatement'],
      }],
      errors: expectedErrors([3, 4, 0, 'Identifier']),
    },
    {
      code: $`
        if (foo) {
            doSomething();
        
        // Intentionally unindented comment
            doSomethingElse();
        }
      `,
      output: $`
        if (foo) {
            doSomething();
        
            // Intentionally unindented comment
            doSomethingElse();
        }
      `,
      options: [4, { ignoreComments: false }],
      errors: expectedErrors([4, 4, 0, 'Line']),
    },
    {
      code: $`
        if (foo) {
            doSomething();
        
        /* Intentionally unindented comment */
            doSomethingElse();
        }
      `,
      output: $`
        if (foo) {
            doSomething();
        
            /* Intentionally unindented comment */
            doSomethingElse();
        }
      `,
      options: [4, { ignoreComments: false }],
      errors: expectedErrors([4, 4, 0, 'Block']),
    },
    {
      code: $`
        const obj = {
            foo () {
                return condition ? // comment
                1 :
                    2
            }
        }
      `,
      output: $`
        const obj = {
            foo () {
                return condition ? // comment
                    1 :
                    2
            }
        }
      `,
      errors: expectedErrors([4, 12, 8, 'Numeric']),
    },

    // ----------------------------------------------------------------------
    // Comment alignment tests
    // ----------------------------------------------------------------------
    {
      code: $`
        if (foo) {
        
        // Comment cannot align with code immediately above if there is a whitespace gap
            doSomething();
        }
      `,
      output: $`
        if (foo) {
        
            // Comment cannot align with code immediately above if there is a whitespace gap
            doSomething();
        }
      `,
      errors: expectedErrors([3, 4, 0, 'Line']),
    },
    {
      code: $`
        if (foo) {
            foo(
                bar);
        // Comment cannot align with code immediately below if there is a whitespace gap
        
        }
      `,
      output: $`
        if (foo) {
            foo(
                bar);
            // Comment cannot align with code immediately below if there is a whitespace gap
        
        }
      `,
      errors: expectedErrors([4, 4, 0, 'Line']),
    },
    {
      code: $`
        [{
            foo
        },
        
            // Comment between nodes
        
        {
            bar
        }];
      `,
      output: $`
        [{
            foo
        },
        
        // Comment between nodes
        
        {
            bar
        }];
      `,
      errors: expectedErrors([5, 0, 4, 'Line']),
    },
    {
      code: $`
        let foo
        
            // comment
        
        ;(async () => {})()
      `,
      output: $`
        let foo
        
        // comment
        
        ;(async () => {})()
      `,
      errors: expectedErrors([3, 0, 4, 'Line']),
    },
    {
      code: $`
        let foo
            // comment
        ;(async () => {})()
      `,
      output: $`
        let foo
        // comment
        ;(async () => {})()
      `,
      errors: expectedErrors([2, 0, 4, 'Line']),
    },
    {
      code: $`
        let foo
        
        /* comment */;
        
        (async () => {})()
      `,
      output: $`
        let foo
        
            /* comment */;
        
        (async () => {})()
      `,
      errors: expectedErrors([3, 4, 0, 'Block']),
    },
    {
      code: $`
            // comment
        
        ;(async () => {})()
      `,
      output: $`
        // comment
        
        ;(async () => {})()
      `,
      errors: expectedErrors([1, 0, 4, 'Line']),
    },
    {
      code: $`
            // comment
        ;(async () => {})()
      `,
      output: $`
        // comment
        ;(async () => {})()
      `,
      errors: expectedErrors([1, 0, 4, 'Line']),
    },
    {
      code: $`
        {
            let foo
        
                // comment
        
            ;(async () => {})()
        
        }
      `,
      output: $`
        {
            let foo
        
            // comment
        
            ;(async () => {})()
        
        }
      `,
      errors: expectedErrors([4, 4, 8, 'Line']),
    },
    {
      code: $`
        {
            let foo
                // comment
            ;(async () => {})()
        
        }
      `,
      output: $`
        {
            let foo
            // comment
            ;(async () => {})()
        
        }
      `,
      errors: expectedErrors([3, 4, 8, 'Line']),
    },
    {
      code: $`
        {
            let foo
        
            /* comment */;
        
            (async () => {})()
        
        }
      `,
      output: $`
        {
            let foo
        
                /* comment */;
        
            (async () => {})()
        
        }
      `,
      errors: expectedErrors([4, 8, 4, 'Block']),
    },
    {
      code: $`
        const foo = 1
        const bar = foo
        
            /* comment */
        
        ;[1, 2, 3].forEach(() => {})
      `,
      output: $`
        const foo = 1
        const bar = foo
        
        /* comment */
        
        ;[1, 2, 3].forEach(() => {})
      `,
      errors: expectedErrors([4, 0, 4, 'Block']),
    },
    {
      code: $`
        const foo = 1
        const bar = foo
            /* comment */
        ;[1, 2, 3].forEach(() => {})
      `,
      output: $`
        const foo = 1
        const bar = foo
        /* comment */
        ;[1, 2, 3].forEach(() => {})
      `,
      errors: expectedErrors([3, 0, 4, 'Block']),
    },
    {
      code: $`
        const foo = 1
        const bar = foo
        
        /* comment */;
        
        [1, 2, 3].forEach(() => {})
      `,
      output: $`
        const foo = 1
        const bar = foo
        
            /* comment */;
        
        [1, 2, 3].forEach(() => {})
      `,
      errors: expectedErrors([4, 4, 0, 'Block']),
    },
    {
      code: $`
            /* comment */
        
        ;[1, 2, 3].forEach(() => {})
      `,
      output: $`
        /* comment */
        
        ;[1, 2, 3].forEach(() => {})
      `,
      errors: expectedErrors([1, 0, 4, 'Block']),
    },
    {
      code: $`
            /* comment */
        ;[1, 2, 3].forEach(() => {})
      `,
      output: $`
        /* comment */
        ;[1, 2, 3].forEach(() => {})
      `,
      errors: expectedErrors([1, 0, 4, 'Block']),
    },
    {
      code: $`
        {
            const foo = 1
            const bar = foo
        
                /* comment */
        
            ;[1, 2, 3].forEach(() => {})
        
        }
      `,
      output: $`
        {
            const foo = 1
            const bar = foo
        
            /* comment */
        
            ;[1, 2, 3].forEach(() => {})
        
        }
      `,
      errors: expectedErrors([5, 4, 8, 'Block']),
    },
    {
      code: $`
        {
            const foo = 1
            const bar = foo
                /* comment */
            ;[1, 2, 3].forEach(() => {})
        
        }
      `,
      output: $`
        {
            const foo = 1
            const bar = foo
            /* comment */
            ;[1, 2, 3].forEach(() => {})
        
        }
      `,
      errors: expectedErrors([4, 4, 8, 'Block']),
    },
    {
      code: $`
        {
            const foo = 1
            const bar = foo
        
            /* comment */;
        
            [1, 2, 3].forEach(() => {})
        
        }
      `,
      output: $`
        {
            const foo = 1
            const bar = foo
        
                /* comment */;
        
            [1, 2, 3].forEach(() => {})
        
        }
      `,
      errors: expectedErrors([5, 8, 4, 'Block']),
    },

    // import expressions
    {
      code: $`
        import(
        source
            )
      `,
      output: $`
        import(
            source
        )
      `,
      parserOptions: { ecmaVersion: 2020 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 0, 4, 'Punctuator'],
      ]),
    },

    // https://github.com/eslint/eslint/issues/12122
    {
      code: $`
        foo(() => {
            tag\`
            multiline
            template\${a} \${b}
            literal
            \`(() => {
            bar();
            });
        });
      `,
      output: $`
        foo(() => {
            tag\`
            multiline
            template\${a} \${b}
            literal
            \`(() => {
                bar();
            });
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [7, 8, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        {
                tag\`
            multiline
            template
            literal
            \${a} \${b}\`(() => {
                    bar();
                });
        }
      `,
      output: $`
        {
            tag\`
            multiline
            template
            literal
            \${a} \${b}\`(() => {
                bar();
            });
        }
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [2, 4, 8, 'Identifier'],
        [7, 8, 12, 'Identifier'],
        [8, 4, 8, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo(() => {
            tagOne\`\${a} \${b}
            multiline
            template
            literal
            \`(() => {
                    tagTwo\`
                multiline
                template
                literal
                \`(() => {
                    bar();
                });
        
                    baz();
        });
        });
      `,
      output: $`
        foo(() => {
            tagOne\`\${a} \${b}
            multiline
            template
            literal
            \`(() => {
                tagTwo\`
                multiline
                template
                literal
                \`(() => {
                    bar();
                });
        
                baz();
            });
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [7, 8, 12, 'Identifier'],
        [15, 8, 12, 'Identifier'],
        [16, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        {
            tagOne\`
            multiline
            template
            literal
            \${a} \${b}\`(() => {
                    tagTwo\`
                multiline
                template
                literal
                \`(() => {
                    bar();
                });
        
                    baz();
        });
        }
      `,
      output: $`
        {
            tagOne\`
            multiline
            template
            literal
            \${a} \${b}\`(() => {
                tagTwo\`
                multiline
                template
                literal
                \`(() => {
                    bar();
                });
        
                baz();
            });
        }
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [7, 8, 12, 'Identifier'],
        [15, 8, 12, 'Identifier'],
        [16, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        tagOne\`multiline \${a} \${b}
                template
                literal
                \`(() => {
        foo();
        
            tagTwo\`multiline
                    template
                    literal
                \`({
            bar: 1,
                baz: 2
            });
        });
      `,
      output: $`
        tagOne\`multiline \${a} \${b}
                template
                literal
                \`(() => {
            foo();
        
            tagTwo\`multiline
                    template
                    literal
                \`({
                bar: 1,
                baz: 2
            });
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [5, 4, 0, 'Identifier'],
        [11, 8, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        tagOne\`multiline
            template \${a} \${b}
            literal\`({
                foo: 1,
        bar: tagTwo\`multiline
                template
                literal\`(() => {
        
        baz();
            })
        });
      `,
      output: $`
        tagOne\`multiline
            template \${a} \${b}
            literal\`({
            foo: 1,
            bar: tagTwo\`multiline
                template
                literal\`(() => {
        
                baz();
            })
        });
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [4, 4, 8, 'Identifier'],
        [5, 4, 0, 'Identifier'],
        [9, 8, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        foo.bar\` template literal \`(() => {
                baz();
        })
      `,
      output: $`
        foo.bar\` template literal \`(() => {
            baz();
        })
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [2, 4, 8, 'Identifier'],
      ]),
    },
    {
      code: $`
        foo.bar.baz\` template literal \`(() => {
        baz();
            })
      `,
      output: $`
        foo.bar.baz\` template literal \`(() => {
            baz();
        })
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 0, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo
            .bar\` template
                literal \`(() => {
                baz();
        })
      `,
      output: $`
        foo
            .bar\` template
                literal \`(() => {
                baz();
            })
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        foo
            .test\`
            \${a} \${b}
            \`(() => {
        bar();
            })
      `,
      output: $`
        foo
            .test\`
            \${a} \${b}
            \`(() => {
                bar();
            })
      `,
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [5, 8, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        foo
            .test\`
            \${a} \${b}
            \`(() => {
        bar();
            })
      `,
      output: $`
        foo
        .test\`
            \${a} \${b}
            \`(() => {
            bar();
        })
      `,
      options: [4, { MemberExpression: 0 }],
      parserOptions: { ecmaVersion: 2015 },
      errors: expectedErrors([
        [2, 0, 4, 'Punctuator'],
        [5, 4, 0, 'Identifier'],
        [6, 0, 4, 'Punctuator'],
      ]),
    },

    // Optional chaining
    {
      code: $`
        obj
        ?.prop
        ?.[key]
        ?.
        [key]
      `,
      output: $`
        obj
            ?.prop
            ?.[key]
            ?.
                [key]
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2020 },
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [3, 4, 0, 'Punctuator'],
        [4, 4, 0, 'Punctuator'],
        [5, 8, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        (
            longSomething
                ?.prop
                ?.[key]
        )
        ?.prop
        ?.[key]
      `,
      output: $`
        (
            longSomething
                ?.prop
                ?.[key]
        )
            ?.prop
            ?.[key]
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2020 },
      errors: expectedErrors([
        [6, 4, 0, 'Punctuator'],
        [7, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        obj
        ?.(arg)
        ?.
        (arg)
      `,
      output: $`
        obj
            ?.(arg)
            ?.
            (arg)
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2020 },
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [3, 4, 0, 'Punctuator'],
        [4, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        (
            longSomething
                ?.(arg)
                ?.(arg)
        )
        ?.(arg)
        ?.(arg)
      `,
      output: $`
        (
            longSomething
                ?.(arg)
                ?.(arg)
        )
            ?.(arg)
            ?.(arg)
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2020 },
      errors: expectedErrors([
        [6, 4, 0, 'Punctuator'],
        [7, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        const foo = async (arg1,
                            arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      output: $`
        const foo = async (arg1,
                           arg2) =>
        {
          return arg1 + arg2;
        }
      `,
      options: [2, { FunctionDeclaration: { parameters: 'first' }, FunctionExpression: { parameters: 'first' } }],
      parserOptions: { ecmaVersion: 2020 },
      errors: expectedErrors([
        [2, 19, 20, 'Identifier'],
      ]),
    },
    {
      code: $`
        const a = async
         b => {}
      `,
      output: $`
        const a = async
        b => {}
      `,
      options: [2],
      errors: expectedErrors([
        [2, 0, 1, 'Identifier'],
      ]),
    },
    {
      code: $`
        class C {
        field1;
        static field2;
        }
      `,
      output: $`
        class C {
            field1;
            static field2;
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 4, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        class C {
        field1
        =
        0
        ;
        static
        field2
        =
        0
        ;
        }
      `,
      output: $`
        class C {
            field1
                =
                    0
                    ;
            static
                field2
                    =
                        0
                        ;
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 8, 0, 'Punctuator'],
        [4, 12, 0, 'Numeric'],
        [5, 12, 0, 'Punctuator'],
        [6, 4, 0, 'Keyword'],
        [7, 8, 0, 'Identifier'],
        [8, 12, 0, 'Punctuator'],
        [9, 16, 0, 'Numeric'],
        [10, 16, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        [
        field1
        ]
        =
        0
        ;
        static
        [
        field2
        ]
        =
        0
        ;
        [
        field3
        ] =
        0;
        [field4] =
        0;
        }
      `,
      output: $`
        class C {
            [
                field1
            ]
                =
                    0
                    ;
            static
            [
                field2
            ]
                =
                    0
                    ;
            [
                field3
            ] =
                0;
            [field4] =
                0;
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [3, 8, 0, 'Identifier'],
        [4, 4, 0, 'Punctuator'],
        [5, 8, 0, 'Punctuator'],
        [6, 12, 0, 'Numeric'],
        [7, 12, 0, 'Punctuator'],
        [8, 4, 0, 'Keyword'],
        [9, 4, 0, 'Punctuator'],
        [10, 8, 0, 'Identifier'],
        [11, 4, 0, 'Punctuator'],
        [12, 8, 0, 'Punctuator'],
        [13, 12, 0, 'Numeric'],
        [14, 12, 0, 'Punctuator'],
        [15, 4, 0, 'Punctuator'],
        [16, 8, 0, 'Identifier'],
        [17, 4, 0, 'Punctuator'],
        [18, 8, 0, 'Numeric'],
        [19, 4, 0, 'Punctuator'],
        [20, 8, 0, 'Numeric'],
      ]),
    },
    {
      code: $`
        class C {
        field1 = (
        foo
        + bar
        );
        }
      `,
      output: $`
        class C {
            field1 = (
                foo
        + bar
            );
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 8, 0, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        #aaa
        foo() {
        return this.#aaa
        }
        }
      `,
      output: $`
        class C {
            #aaa
            foo() {
                return this.#aaa
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'PrivateIdentifier'],
        [3, 4, 0, 'Identifier'],
        [4, 8, 0, 'Keyword'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
          static {
            foo();
            bar();
          }
        }
      `,
      options: [2],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 2, 0, 'Keyword'],
        [3, 4, 0, 'Identifier'],
        [4, 4, 0, 'Identifier'],
        [5, 2, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
            static {
                foo();
                bar();
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 8, 0, 'Identifier'],
        [4, 8, 0, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
                static {
            foo();
        bar();
                }
        }
      `,
      output: $`
        class C {
            static {
                foo();
                bar();
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 8, 'Keyword'],
        [3, 8, 4, 'Identifier'],
        [4, 8, 0, 'Identifier'],
        [5, 4, 8, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
            static {
                    foo();
                    bar();
            }
        }
      `,
      options: [4, { StaticBlock: { body: 2 } }],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 12, 0, 'Identifier'],
        [4, 12, 0, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
            static {
            foo();
            bar();
            }
        }
      `,
      options: [4, { StaticBlock: { body: 0 } }],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 4, 0, 'Identifier'],
        [4, 4, 0, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
        \tstatic {
        \t\tfoo();
        \t\tbar();
        \t}
        }
      `,
      options: ['tab'],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors('tab', [
        [2, 1, 0, 'Keyword'],
        [3, 2, 0, 'Identifier'],
        [4, 2, 0, 'Identifier'],
        [5, 1, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
        \tstatic {
        \t\t\tfoo();
        \t\t\tbar();
        \t}
        }
      `,
      options: ['tab', { StaticBlock: { body: 2 } }],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors('tab', [
        [2, 1, 0, 'Keyword'],
        [3, 3, 0, 'Identifier'],
        [4, 3, 0, 'Identifier'],
        [5, 1, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static
        {
        foo();
        bar();
        }
        }
      `,
      output: $`
        class C {
            static
            {
                foo();
                bar();
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 4, 0, 'Punctuator'],
        [4, 8, 0, 'Identifier'],
        [5, 8, 0, 'Identifier'],
        [6, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
            static
                {
                foo();
                bar();
                }
        }
      `,
      output: $`
        class C {
            static
            {
                foo();
                bar();
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [3, 4, 8, 'Punctuator'],
        [6, 4, 8, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        var x,
        y;
        }
        }
      `,
      output: $`
        class C {
            static {
                var x,
                    y;
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 8, 0, 'Keyword'],
        [4, 12, 0, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static
        {
        var x,
        y;
        }
        }
      `,
      output: $`
        class C {
            static
            {
                var x,
                    y;
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 4, 0, 'Punctuator'],
        [4, 8, 0, 'Keyword'],
        [5, 12, 0, 'Identifier'],
        [6, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        if (foo) {
        bar;
        }
        }
        }
      `,
      output: $`
        class C {
            static {
                if (foo) {
                    bar;
                }
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 8, 0, 'Keyword'],
        [4, 12, 0, 'Identifier'],
        [5, 8, 0, 'Punctuator'],
        [6, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {
        {
        bar;
        }
        }
        }
      `,
      output: $`
        class C {
            static {
                {
                    bar;
                }
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 8, 0, 'Punctuator'],
        [4, 12, 0, 'Identifier'],
        [5, 8, 0, 'Punctuator'],
        [6, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        static {}
        
        static {
        }
        
        static
        {
        }
        }
      `,
      output: $`
        class C {
            static {}
        
            static {
            }
        
            static
            {
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [4, 4, 0, 'Keyword'],
        [5, 4, 0, 'Punctuator'],
        [7, 4, 0, 'Keyword'],
        [8, 4, 0, 'Punctuator'],
        [9, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        
        static {
            foo;
        }
        
        static {
            bar;
        }
        
        }
      `,
      output: $`
        class C {
        
            static {
                foo;
            }
        
            static {
                bar;
            }
        
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [3, 4, 0, 'Keyword'],
        [4, 8, 4, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
        [7, 4, 0, 'Keyword'],
        [8, 8, 4, 'Identifier'],
        [9, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        
        x = 1;
        
        static {
            foo;
        }
        
        y = 2;
        
        }
      `,
      output: $`
        class C {
        
            x = 1;
        
            static {
                foo;
            }
        
            y = 2;
        
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [3, 4, 0, 'Identifier'],
        [5, 4, 0, 'Keyword'],
        [6, 8, 4, 'Identifier'],
        [7, 4, 0, 'Punctuator'],
        [9, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        class C {
        
        method1(param) {
            foo;
        }
        
        static {
            bar;
        }
        
        method2(param) {
            foo;
        }
        
        }
      `,
      output: $`
        class C {
        
            method1(param) {
                foo;
            }
        
            static {
                bar;
            }
        
            method2(param) {
                foo;
            }
        
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [3, 4, 0, 'Identifier'],
        [4, 8, 4, 'Identifier'],
        [5, 4, 0, 'Punctuator'],
        [7, 4, 0, 'Keyword'],
        [8, 8, 4, 'Identifier'],
        [9, 4, 0, 'Punctuator'],
        [11, 4, 0, 'Identifier'],
        [12, 8, 4, 'Identifier'],
        [13, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        function f() {
        class C {
        static {
        foo();
        bar();
        }
        }
        }
      `,
      output: $`
        function f() {
            class C {
                static {
                    foo();
                    bar();
                }
            }
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 8, 0, 'Keyword'],
        [4, 12, 0, 'Identifier'],
        [5, 12, 0, 'Identifier'],
        [6, 8, 0, 'Punctuator'],
        [7, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        class C {
        method() {
        foo;
        }
        static {
        bar;
        }
        }
      `,
      output: $`
        class C {
            method() {
                    foo;
            }
            static {
                    bar;
            }
        }
      `,
      options: [4, { FunctionExpression: { body: 2 }, StaticBlock: { body: 2 } }],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 12, 0, 'Identifier'],
        [4, 4, 0, 'Punctuator'],
        [5, 4, 0, 'Keyword'],
        [6, 12, 0, 'Identifier'],
        [7, 4, 0, 'Punctuator'],
      ]),
    },

    {
      code: $`
        class C {
        foo =
        "bar";
        }
      `,
      output: $`
        class C {
            foo =
                "bar";
        }
      `,
      options: [4],
      parserOptions: { ecmaVersion: 2022 },
      errors: expectedErrors([
        [2, 4, 0, 'Identifier'],
        [3, 8, 0, 'String'],
      ]),
    },

    // https://github.com/eslint/eslint/issues/15930
    {
      code: $`
        if (2 > 1)
        \tconsole.log('a')
        \t;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        if (2 > 1)
        \tconsole.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [3, 0, 1, 'Punctuator']),
    },
    {
      code: $`
        if (2 > 1)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        if (2 > 1)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo) bar();
            baz()
      `,
      output: $`
        if (foo) bar();
        baz()
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Identifier']),
    },
    {
      code: $`
        if (foo) bar()
            ;baz()
      `,
      output: $`
        if (foo) bar()
        ;baz()
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            bar();
            baz();
      `,
      output: $`
        if (foo)
            bar();
        baz();
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Identifier']),
    },
    {
      code: $`
        if (foo)
            bar()
            ; baz()
      `,
      output: $`
        if (foo)
            bar()
        ; baz()
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            bar()
            ;baz()
            qux()
      `,
      output: $`
        if (foo)
            bar()
        ;baz()
        qux()
      `,
      options: [4],
      errors: expectedErrors([
        [3, 0, 4, 'Punctuator'],
        [4, 0, 4, 'Identifier'],
      ]),
    },
    {
      code: $`
        if (foo)
            bar()
            ;else
            baz()
      `,
      output: $`
        if (foo)
            bar()
        ;else
            baz()
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            bar()
        else
            baz()
            ;qux()
      `,
      output: $`
        if (foo)
            bar()
        else
            baz()
        ;qux()
      `,
      options: [4],
      errors: expectedErrors([5, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            if (bar)
                baz()
            ;qux()
      `,
      output: $`
        if (foo)
            if (bar)
                baz()
        ;qux()
      `,
      options: [4],
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            bar()
        else if (baz)
            qux()
            ;quux()
      `,
      output: $`
        if (foo)
            bar()
        else if (baz)
            qux()
        ;quux()
      `,
      options: [4],
      errors: expectedErrors([5, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            if (bar)
                baz()
            else
                qux()
            ;quux()
      `,
      output: $`
        if (foo)
            if (bar)
                baz()
            else
                qux()
        ;quux()
      `,
      options: [4],
      errors: expectedErrors([6, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            bar()
        ;
        baz()
      `,
      output: $`
        if (foo)
            bar()
            ;
        baz()
      `,
      options: [4],
      errors: expectedErrors([3, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
        ;
        baz()
      `,
      output: $`
        if (foo)
            ;
        baz()
      `,
      options: [4],
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            ;baz()
      `,
      output: $`
        if (foo)
        ;baz()
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        if (foo);
            else
            baz()
      `,
      output: $`
        if (foo);
        else
            baz()
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Keyword']),
    },
    {
      code: $`
        if (foo)
        ;
        else
            baz()
      `,
      output: $`
        if (foo)
            ;
        else
            baz()
      `,
      options: [4],
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        if (foo)
            ;else
            baz()
      `,
      output: $`
        if (foo)
        ;else
            baz()
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        do foo();
            while (bar)
      `,
      output: $`
        do foo();
        while (bar)
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Keyword']),
    },
    {
      code: $`
        do foo()
            ;while (bar)
      `,
      output: $`
        do foo()
        ;while (bar)
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        do
            foo();
            while (bar)
      `,
      output: $`
        do
            foo();
        while (bar)
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Keyword']),
    },
    {
      code: $`
        do
            foo()
            ;while (bar)
      `,
      output: $`
        do
            foo()
        ;while (bar)
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        do;
            while (foo)
      `,
      output: $`
        do;
        while (foo)
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Keyword']),
    },
    {
      code: $`
        do
        ;
        while (foo)
      `,
      output: $`
        do
            ;
        while (foo)
      `,
      options: [4],
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: $`
        do
            ;while (foo)
      `,
      output: $`
        do
        ;while (foo)
      `,
      options: [4],
      errors: expectedErrors([2, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        while (2 > 1)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        while (2 > 1)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        for (;;)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        for (;;)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        for (a in b)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        for (a in b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        for (a of b)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        for (a of b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        with (a)
            console.log(b)
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        with (a)
            console.log(b)
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
      parserOptions: { sourceType: 'script' },
    },
    {
      code: $`
        label: for (a of b)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        label: for (a of b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([3, 0, 4, 'Punctuator']),
    },
    {
      code: $`
        label:
        for (a of b)
            console.log('a')
            ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      output: $`
        label:
        for (a of b)
            console.log('a')
        ;[1, 2, 3].forEach(x=>console.log(x))
      `,
      options: [4],
      errors: expectedErrors([4, 0, 4, 'Punctuator']),
    },

    // https://github.com/eslint/eslint/issues/17316
    {
      code: $`
        if (foo)
        \tif (bar) doSomething();
        \telse doSomething();
        else
        if (bar) doSomething();
        else doSomething();
      `,
      output: $`
        if (foo)
        \tif (bar) doSomething();
        \telse doSomething();
        else
        \tif (bar) doSomething();
        \telse doSomething();
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [
        [5, 1, 0, 'Keyword'],
        [6, 1, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
        \tif (bar) doSomething();
        \telse doSomething();
        else
        \t\tif (bar) doSomething();
        \t\telse doSomething();
      `,
      output: $`
        if (foo)
        \tif (bar) doSomething();
        \telse doSomething();
        else
        \tif (bar) doSomething();
        \telse doSomething();
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [
        [5, 1, 2, 'Keyword'],
        [6, 1, 2, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (bar) doSomething();
        else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (bar) doSomething();
            else doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 4, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (bar)
        doSomething();
        else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (bar)
                doSomething();
            else doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 8, 0, 'Identifier'],
        [7, 4, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (bar) doSomething();
        else
        doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (bar) doSomething();
            else
                doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 4, 0, 'Keyword'],
        [7, 8, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (bar)
            doSomething();
        else
        doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (bar)
                doSomething();
            else
                doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 8, 4, 'Identifier'],
        [7, 4, 0, 'Keyword'],
        [8, 8, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar) doSomething();
            else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar) doSomething();
        else doSomething();
      `,
      errors: expectedErrors([
        [5, 0, 4, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
            else if (bar)
                doSomething();
            else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar)
            doSomething();
        else doSomething();
      `,
      errors: expectedErrors([
        [4, 0, 4, 'Keyword'],
        [5, 4, 8, 'Identifier'],
        [6, 0, 4, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar) doSomething();
             else
                 doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar) doSomething();
        else
            doSomething();
      `,
      errors: expectedErrors([
        [5, 0, 5, 'Keyword'],
        [6, 4, 9, 'Identifier'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar)
        doSomething();
        else
        doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (bar)
            doSomething();
        else
            doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Identifier'],
        [7, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (bar) doSomething();
            else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (bar) doSomething();
                else doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 8, 4, 'Keyword'],
        [7, 8, 4, 'Keyword'],
        [8, 4, 0, 'Keyword'],
        [9, 8, 4, 'Keyword'],
        [10, 8, 4, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (foo)
        if (bar) doSomething();
        else
        if (bar) doSomething();
        else doSomething();
        else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (foo)
                if (bar) doSomething();
                else
                    if (bar) doSomething();
                    else doSomething();
            else doSomething();
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 8, 0, 'Keyword'],
        [7, 8, 0, 'Keyword'],
        [8, 12, 0, 'Keyword'],
        [9, 12, 0, 'Keyword'],
        [10, 4, 0, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
        if (bar) doSomething();
        else doSomething();
        else if (foo) doSomething();
            else doSomething();
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (foo) doSomething();
        else doSomething();
      `,
      errors: expectedErrors([
        [2, 4, 0, 'Keyword'],
        [3, 4, 0, 'Keyword'],
        [5, 0, 4, 'Keyword'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (foo) {
        doSomething();
        }
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (foo) {
            doSomething();
        }
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Identifier'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (foo)
            {
                doSomething();
            }
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else if (foo)
        {
            doSomething();
        }
      `,
      errors: expectedErrors([
        [5, 0, 4, 'Punctuator'],
        [6, 4, 8, 'Identifier'],
        [7, 0, 4, 'Punctuator'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (foo) {
            doSomething();
        }
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (foo) {
                doSomething();
            }
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 8, 4, 'Identifier'],
        [7, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
        if (foo)
        {
            doSomething();
        }
      `,
      output: $`
        if (foo)
            if (bar) doSomething();
            else doSomething();
        else
            if (foo)
            {
                doSomething();
            }
      `,
      errors: expectedErrors([
        [5, 4, 0, 'Keyword'],
        [6, 4, 0, 'Punctuator'],
        [7, 8, 4, 'Identifier'],
        [8, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: $`
        function foo() {
          bar();
          \tbaz();
        \t   \t\t\t  \t\t\t  \t   \tqux();
        }
      `,
      options: [2],
      output: $`
        function foo() {
          bar();
          baz();
          qux();
        }
      `,
    },
    {
      code: $`
        function foo() {
          bar();
           \t\t}
      `,
      options: [2],
      output: $`
        function foo() {
          bar();
        }
      `,
    },
    {
      code: $`
        {
        \tvar x = 1,
        \t    y = 2;
        }
      `,
      options: ['tab'],
      output: $`
        {
        \tvar x = 1,
        \t\ty = 2;
        }
      `,
    },
  ],
})
