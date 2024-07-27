# Changelog

## [2.4.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.3.0...v2.4.0) (2024-07-27)


### Features

* migrate to `@types/eslint` `v9.6.0` ([#479](https://github.com/eslint-stylistic/eslint-stylistic/issues/479)) ([ea72aae](https://github.com/eslint-stylistic/eslint-stylistic/commit/ea72aaedc94c8178aa338f563b717f33ffc713f7))


### Bug Fixes

* **indent:** handle mixed spaces and tabs ([#465](https://github.com/eslint-stylistic/eslint-stylistic/issues/465)) ([d5ae88d](https://github.com/eslint-stylistic/eslint-stylistic/commit/d5ae88d6602f0e506872d06ef3dd1b4e6443638e))
* **ts:** chunk bundling ([a278468](https://github.com/eslint-stylistic/eslint-stylistic/commit/a27846842778970d2a1d9d91799aec8e233fc840))
* **type-generic-spacing:** consider parentheses ([#467](https://github.com/eslint-stylistic/eslint-stylistic/issues/467)) ([fd08dd8](https://github.com/eslint-stylistic/eslint-stylistic/commit/fd08dd862081d34094423441115f39d7013b6464))


### Documentation

* fix note block display ([#471](https://github.com/eslint-stylistic/eslint-stylistic/issues/471)) ([28db32c](https://github.com/eslint-stylistic/eslint-stylistic/commit/28db32cb894cb1f7a70eaa0ef5f162aaaf1cf08c))
* **ts/member-delimiter-style:** fix spaces ([#461](https://github.com/eslint-stylistic/eslint-stylistic/issues/461)) ([240006c](https://github.com/eslint-stylistic/eslint-stylistic/commit/240006cd887de265dc33eb027765846bd877bfd2))
* update project progress ([#449](https://github.com/eslint-stylistic/eslint-stylistic/issues/449)) ([d6d72c8](https://github.com/eslint-stylistic/eslint-stylistic/commit/d6d72c8975f8a9be0e25dd6c41d03d90b00b2a62))

## [2.3.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.2.2...v2.3.0) (2024-06-25)


### Features

* **js/array-element-newline:** options multiline and consistent combination ([#445](https://github.com/eslint-stylistic/eslint-stylistic/issues/445)) ([cfd3327](https://github.com/eslint-stylistic/eslint-stylistic/commit/cfd332766de15e9ab29e92c5048640a07f2f15bd))
* **ts:** add `object-curly-newline` and `object-property-newline` ([#444](https://github.com/eslint-stylistic/eslint-stylistic/issues/444)) ([036d3de](https://github.com/eslint-stylistic/eslint-stylistic/commit/036d3de3a02e86dde21b01369f98521571cd4273))


### Bug Fixes

* **jsx-indent:** deprecate `jsx-indent` rule in favor of `indent` ([#447](https://github.com/eslint-stylistic/eslint-stylistic/issues/447)) ([57dd2e8](https://github.com/eslint-stylistic/eslint-stylistic/commit/57dd2e8b5927e6f9de019fff6e83cac4989de7ce))

## [2.2.2](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.2.1...v2.2.2) (2024-06-19)


### Bug Fixes

* **indent:** correct class property initialization ([#431](https://github.com/eslint-stylistic/eslint-stylistic/issues/431)) ([09ea5b0](https://github.com/eslint-stylistic/eslint-stylistic/commit/09ea5b0fdccc3f8585cfaf574914f4f9c2109d5d))
* **plus/indent-binary-ops:** considring `||` and `&&` ([#430](https://github.com/eslint-stylistic/eslint-stylistic/issues/430)) ([9627a10](https://github.com/eslint-stylistic/eslint-stylistic/commit/9627a10af0e873475b0a90fef289a45033370df3))


### Documentation

* add flat config versions for Migrate to 1-to-1 Plugins ([#435](https://github.com/eslint-stylistic/eslint-stylistic/issues/435)) ([d670924](https://github.com/eslint-stylistic/eslint-stylistic/commit/d6709241555f6acd34c52325c3a044f32f1b8241))
* fix indentation in jsx.md ([#434](https://github.com/eslint-stylistic/eslint-stylistic/issues/434)) ([578fce1](https://github.com/eslint-stylistic/eslint-stylistic/commit/578fce1a7311a5ae25fa4781577b25c3df5b64c7))
* fix typo in migration.md ([#432](https://github.com/eslint-stylistic/eslint-stylistic/issues/432)) ([fc38d86](https://github.com/eslint-stylistic/eslint-stylistic/commit/fc38d86faa632807aa869f2e2906ea133c487558))


### Chores

* **indent:** add tests ([#428](https://github.com/eslint-stylistic/eslint-stylistic/issues/428)) ([1334417](https://github.com/eslint-stylistic/eslint-stylistic/commit/1334417307871bee72718c4d3056ac3e29d935e2))

## [2.2.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.2.0...v2.2.1) (2024-06-17)


### Bug Fixes

* **indent:** correct indentation in chained methods calls with generics ([#424](https://github.com/eslint-stylistic/eslint-stylistic/issues/424)) ([4ba8b08](https://github.com/eslint-stylistic/eslint-stylistic/commit/4ba8b0866e602dd416d367d6435c747d594bbe97))
* **indent:** handle undefined `node.decorators` when tsParser is not configured ([#422](https://github.com/eslint-stylistic/eslint-stylistic/issues/422)) ([3d63054](https://github.com/eslint-stylistic/eslint-stylistic/commit/3d63054ca962a00cdc5a3b4406daac97e7b94371))

## [2.2.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.1.0...v2.2.0) (2024-06-15)


### Features

* **indent:** support for JSXText indentation ([#413](https://github.com/eslint-stylistic/eslint-stylistic/issues/413)) ([a5b62a0](https://github.com/eslint-stylistic/eslint-stylistic/commit/a5b62a04d3b25d6144a5935f0ed9370487f26409))
* **js:** add option `ignoreStringLiterals` ([#401](https://github.com/eslint-stylistic/eslint-stylistic/issues/401)) ([1b6d563](https://github.com/eslint-stylistic/eslint-stylistic/commit/1b6d563921b408723fa9a5bd911f5890c698f649)), closes [#400](https://github.com/eslint-stylistic/eslint-stylistic/issues/400)
* **jsx-one-expression-per-line:** allow `non-jsx` ([#393](https://github.com/eslint-stylistic/eslint-stylistic/issues/393)) ([431d564](https://github.com/eslint-stylistic/eslint-stylistic/commit/431d56475af2ba183421cb051e486b2bb6940169))


### Bug Fixes

* **indent:** correct indentation for `PropertyDefinition` with decorators ([#416](https://github.com/eslint-stylistic/eslint-stylistic/issues/416)) ([4b4d27c](https://github.com/eslint-stylistic/eslint-stylistic/commit/4b4d27c0ede2bada33aab5cb9fcdca7e77448b8a))
* make plugin assignable to ESLint.Plugin ([#418](https://github.com/eslint-stylistic/eslint-stylistic/issues/418)) ([9887ead](https://github.com/eslint-stylistic/eslint-stylistic/commit/9887ead9ae485fa8393e2f7b529074bf04200867))
* **quotes:** allow template literals to avoid escape sequences ([#410](https://github.com/eslint-stylistic/eslint-stylistic/issues/410)) ([1891c5f](https://github.com/eslint-stylistic/eslint-stylistic/commit/1891c5fd8ae3580b892694836c2a387070de2084))

## [2.1.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.0.0...v2.1.0) (2024-05-09)


### Features

* **js:** port `multiline-comment-style` and `line-comment-position` ([#389](https://github.com/eslint-stylistic/eslint-stylistic/issues/389)) ([e3212fe](https://github.com/eslint-stylistic/eslint-stylistic/commit/e3212fe2e9daca4e1be69751654eb3c0c1176929))

## [2.0.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v1.8.1...v2.0.0) (2024-05-08)


### ⚠ BREAKING CHANGES

* requires Node `^18.18.0 || ^20.9.0 || >=21.1.0`, bump deps ([#337](https://github.com/eslint-stylistic/eslint-stylistic/issues/337))

### Features

* requires Node `^18.18.0 || ^20.9.0 || &gt;=21.1.0`, bump deps ([#337](https://github.com/eslint-stylistic/eslint-stylistic/issues/337)) ([300ce2c](https://github.com/eslint-stylistic/eslint-stylistic/commit/300ce2cdf3154dcfd139e60546234ec8fd2620d2))

## [1.8.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v1.8.0...v1.8.1) (2024-05-07)


### Bug Fixes

* **jsx-one-expression-per-line:** only one line break has not been processed ([#384](https://github.com/eslint-stylistic/eslint-stylistic/issues/384)) ([a297f84](https://github.com/eslint-stylistic/eslint-stylistic/commit/a297f8434894fab99c5a2792477a8f9818aa3031))


### Documentation

* fix "Contributing" link ([#383](https://github.com/eslint-stylistic/eslint-stylistic/issues/383)) ([c89125f](https://github.com/eslint-stylistic/eslint-stylistic/commit/c89125f7e81cfb5ebce37ce65bfdba726456574a))
* fix broken link in ts/lines-between-class-members rule ([#385](https://github.com/eslint-stylistic/eslint-stylistic/issues/385)) ([594a860](https://github.com/eslint-stylistic/eslint-stylistic/commit/594a860b25ae032d11dddf0cf1303d3ee6d3c934))
* fix link ([#379](https://github.com/eslint-stylistic/eslint-stylistic/issues/379)) ([5060350](https://github.com/eslint-stylistic/eslint-stylistic/commit/5060350fe3ecc3acd7fae83eb45cbd4de9c06fb5))
* improve docs search, close [#381](https://github.com/eslint-stylistic/eslint-stylistic/issues/381) ([d0df679](https://github.com/eslint-stylistic/eslint-stylistic/commit/d0df679403645bfddceb629bb35284bb9ae0a38a))

## [1.8.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v1.7.2...v1.8.0) (2024-04-30)


### Features

* **jsx-function-call-newline:** add jsx-function-call-newline rule ([#376](https://github.com/eslint-stylistic/eslint-stylistic/issues/376)) ([110aa4c](https://github.com/eslint-stylistic/eslint-stylistic/commit/110aa4ccc33371e47943952e1b595d67239ef5dc))
* **jsx-one-expression-per-line:** allow single line ([#377](https://github.com/eslint-stylistic/eslint-stylistic/issues/377)) ([f8825f2](https://github.com/eslint-stylistic/eslint-stylistic/commit/f8825f290cd049c07f17dd2fea16ffec6e532e39))
* **jsx-wrap-multilines:** supports adding parentheses and line breaks for object properties ([#372](https://github.com/eslint-stylistic/eslint-stylistic/issues/372)) ([c72d043](https://github.com/eslint-stylistic/eslint-stylistic/commit/c72d0437e4cf447918b0750200cf8fb6a46af2cf))


### Bug Fixes

* **jsx-indent:** conflict between indent and jsx-indent ([#368](https://github.com/eslint-stylistic/eslint-stylistic/issues/368)) ([7313184](https://github.com/eslint-stylistic/eslint-stylistic/commit/731318474fd5c7b0abe7f21abcb7334949bafc2e))


### Documentation

* update links ([f80db20](https://github.com/eslint-stylistic/eslint-stylistic/commit/f80db20d67d2f796655fd83de370609e21fa701f))

## [1.7.2](https://github.com/eslint-community/eslint-stylistic/compare/v1.7.1...v1.7.2) (2024-04-14)


### Documentation

* fix link to selectors ([#345](https://github.com/eslint-community/eslint-stylistic/issues/345)) ([54bafb7](https://github.com/eslint-community/eslint-stylistic/commit/54bafb76c43bb8e808b5019f5d9e9e8a4e0ee387))
* **no-mixed-operators:** clarify rule behavior for parameter 'groups' ([#302](https://github.com/eslint-community/eslint-stylistic/issues/302)) ([cd02cea](https://github.com/eslint-community/eslint-stylistic/commit/cd02cea85ce3cafee1d8bf5f3b4dfa9bee920542))
* redirect curly to eslint page ([#309](https://github.com/eslint-community/eslint-stylistic/issues/309)) ([4d0e78e](https://github.com/eslint-community/eslint-stylistic/commit/4d0e78ecc222d7af39c01fdd95d08d5af7491754))
* update repo url ([618eb66](https://github.com/eslint-community/eslint-stylistic/commit/618eb6614a6d08f694ec61ce62df0f4865285230))
* update repro link ([83e35d1](https://github.com/eslint-community/eslint-stylistic/commit/83e35d13ba0a54ef484e20ac5df143b600d38fd3))


### Build Related

* try using a single package for release-please ([b3bf006](https://github.com/eslint-community/eslint-stylistic/commit/b3bf006e340a5690479b82f457c4f9826ef24e67))

## [1.7.1](https://github.com/eslint-community/eslint-stylistic/compare/monorepo-v1.7.0...monorepo-v1.7.1) (2024-04-11)


### Documentation

* **no-mixed-operators:** clarify rule behavior for parameter 'groups' ([#302](https://github.com/eslint-community/eslint-stylistic/issues/302)) ([cd02cea](https://github.com/eslint-community/eslint-stylistic/commit/cd02cea85ce3cafee1d8bf5f3b4dfa9bee920542))
* redirect curly to eslint page ([#309](https://github.com/eslint-community/eslint-stylistic/issues/309)) ([4d0e78e](https://github.com/eslint-community/eslint-stylistic/commit/4d0e78ecc222d7af39c01fdd95d08d5af7491754))
* update repo url ([618eb66](https://github.com/eslint-community/eslint-stylistic/commit/618eb6614a6d08f694ec61ce62df0f4865285230))
* update repro link ([83e35d1](https://github.com/eslint-community/eslint-stylistic/commit/83e35d13ba0a54ef484e20ac5df143b600d38fd3))
