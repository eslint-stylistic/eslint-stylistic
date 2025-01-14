# Changelog

## [2.13.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.12.1...v2.13.0) (2025-01-13)


### Features

* **key-spacing:** add ignoredNodes option ([#640](https://github.com/eslint-stylistic/eslint-stylistic/issues/640)) ([33ae1f6](https://github.com/eslint-stylistic/eslint-stylistic/commit/33ae1f6fbeb15f36967998fe566b74df7db8d3d5))
* **no-extra-parens:** introduce `nestedConditionalExpressions` option ([#657](https://github.com/eslint-stylistic/eslint-stylistic/issues/657)) ([bf63800](https://github.com/eslint-stylistic/eslint-stylistic/commit/bf63800c49218d554c79b4da6513c8ef90f59857))
* **padded-blocks:** add start and end options ([#655](https://github.com/eslint-stylistic/eslint-stylistic/issues/655)) ([cf49939](https://github.com/eslint-stylistic/eslint-stylistic/commit/cf49939a716a8f66f2d5be1d043a7c736133a986))


### Bug Fixes

* **indent-binary-ops:** correctly handle `TypeAliasDeclaration` ([#647](https://github.com/eslint-stylistic/eslint-stylistic/issues/647)) ([ca2aabc](https://github.com/eslint-stylistic/eslint-stylistic/commit/ca2aabc52a9d219cd16889cc9c4ea8b04d6af054))
* **indent-binary-ops:** indent on multiline assignment ([#644](https://github.com/eslint-stylistic/eslint-stylistic/issues/644)) ([d708587](https://github.com/eslint-stylistic/eslint-stylistic/commit/d7085874e84d7113a140878650f90f4efae87766))


### Documentation

* fix incorrect breadcrumbs ([#642](https://github.com/eslint-stylistic/eslint-stylistic/issues/642)) ([eea9267](https://github.com/eslint-stylistic/eslint-stylistic/commit/eea92676326d26ec3786d2e2ee842507678fb565))
* **indent:** fix incorrect option description ([#638](https://github.com/eslint-stylistic/eslint-stylistic/issues/638)) ([d427d47](https://github.com/eslint-stylistic/eslint-stylistic/commit/d427d47c430b5d9db90349438eaaa2c30b083511))


### Chores

* replace deprecated `isSpaceBetweenTokens` with `isSpaceBetween` ([#646](https://github.com/eslint-stylistic/eslint-stylistic/issues/646)) ([6da7c42](https://github.com/eslint-stylistic/eslint-stylistic/commit/6da7c42da0633ad9c8156910200c592cbe888a30))

## [2.12.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.12.0...v2.12.1) (2024-12-11)


### Features

* **indent:** introduce `offsetTernaryExpressionsOffsetCallExpressions` options ([#636](https://github.com/eslint-stylistic/eslint-stylistic/issues/636)) ([c14a3ee](https://github.com/eslint-stylistic/eslint-stylistic/commit/c14a3eef1898c0ade0952208a4a470a6c6dd091f))


### Documentation

* correct eslint flat config in migration guide ([#634](https://github.com/eslint-stylistic/eslint-stylistic/issues/634)) ([16a0ae0](https://github.com/eslint-stylistic/eslint-stylistic/commit/16a0ae0b181230007ca7b80c1eb60b13e79a1ac2))


### Chores

* release-please-mark ([e9ca882](https://github.com/eslint-stylistic/eslint-stylistic/commit/e9ca88292b0c137226dadfbfa77bf9d73584802b))

## [2.12.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.11.0...v2.12.0) (2024-12-08)


### Bug Fixes

* **comma-style:** handles comma after default import and trailing comma ([#600](https://github.com/eslint-stylistic/eslint-stylistic/issues/600)) ([2d8d8ce](https://github.com/eslint-stylistic/eslint-stylistic/commit/2d8d8ce57a12b597de1cffab8e9784b8e20fca15))
* **function-call-spacing:** remove invalid defaults from schema ([#617](https://github.com/eslint-stylistic/eslint-stylistic/issues/617)) ([0714754](https://github.com/eslint-stylistic/eslint-stylistic/commit/07147543dad01ecdf99ebb17b00384f134926bc5))
* **indent:** consider `CallExpression` when `offsetTernaryExpressions` is true ([#625](https://github.com/eslint-stylistic/eslint-stylistic/issues/625)) ([55d3529](https://github.com/eslint-stylistic/eslint-stylistic/commit/55d3529bd8da0d5d944e0647713a8afa17296639))
* **jsx-wrap-multilines:** text between replacement texts included in parentheses ([#618](https://github.com/eslint-stylistic/eslint-stylistic/issues/618)) ([0764252](https://github.com/eslint-stylistic/eslint-stylistic/commit/07642521b779636a9580d5236a0e03fceaa74d58))


### Documentation

* support eslint v9 parser ([#631](https://github.com/eslint-stylistic/eslint-stylistic/issues/631)) ([0e4b1cb](https://github.com/eslint-stylistic/eslint-stylistic/commit/0e4b1cbd6df7f7ef45f99c5fe4bfc99bb595f009))


### Chores

* release-please-mark ([ceff702](https://github.com/eslint-stylistic/eslint-stylistic/commit/ceff702a78e6abc0f714714fedfab3100d2f5625))

## [2.11.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.10.1...v2.11.0) (2024-11-19)


### Features

* **comma-dangle:** add support for Import Attributes ([#586](https://github.com/eslint-stylistic/eslint-stylistic/issues/586)) ([4c177c3](https://github.com/eslint-stylistic/eslint-stylistic/commit/4c177c35057652e3872f65756fa62dc05b34cf93))
* **comma-style:** add support for more syntax ([#597](https://github.com/eslint-stylistic/eslint-stylistic/issues/597)) ([922151c](https://github.com/eslint-stylistic/eslint-stylistic/commit/922151c98b2dc75ad4a135f082050b9dd1b26d11))
* **function-call-argument-newline:** add support for Import Attributes ([#603](https://github.com/eslint-stylistic/eslint-stylistic/issues/603)) ([8ee0c24](https://github.com/eslint-stylistic/eslint-stylistic/commit/8ee0c24da827c36da3df2e9724744b88fc3aa988))
* **function-call-spacing:** add `optionalChain` to control the space around the `optional chain` ([#605](https://github.com/eslint-stylistic/eslint-stylistic/issues/605)) ([f732798](https://github.com/eslint-stylistic/eslint-stylistic/commit/f73279887c755db71e47cb3248fea746fb34e783))
* **function-paren-newline:** add support for Import Attributes ([#585](https://github.com/eslint-stylistic/eslint-stylistic/issues/585)) ([4ede153](https://github.com/eslint-stylistic/eslint-stylistic/commit/4ede153af46af01ed3250e16365975e034631455))


### Bug Fixes

* fix the `update` script in `Windows` ([#604](https://github.com/eslint-stylistic/eslint-stylistic/issues/604)) ([dede119](https://github.com/eslint-stylistic/eslint-stylistic/commit/dede11938e3e15a9e36efefeb548eaa1f3cb1484))


### Build Related

* **deps:** bump codecov/codecov-action from 4 to 5 ([#612](https://github.com/eslint-stylistic/eslint-stylistic/issues/612)) ([047a384](https://github.com/eslint-stylistic/eslint-stylistic/commit/047a3840e43bea3731c5bef629e18a06b10c55a8))

## [2.10.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.10.0...v2.10.1) (2024-11-01)


### Features

* **indent-binary-ops:** disabled to lower indent when starts closing bracket ([#591](https://github.com/eslint-stylistic/eslint-stylistic/issues/591)) ([25fe554](https://github.com/eslint-stylistic/eslint-stylistic/commit/25fe554cc19e0193e973dd4dd48ed5e218b5c6a5))


### Bug Fixes

* **key-spacing:** crash for import without attributes when using `align: "colon"` ([#594](https://github.com/eslint-stylistic/eslint-stylistic/issues/594)) ([6000f43](https://github.com/eslint-stylistic/eslint-stylistic/commit/6000f43d0d6522af1616192321a84cb2ead9b95d))


### Chores

* release-please-mark ([5e7a284](https://github.com/eslint-stylistic/eslint-stylistic/commit/5e7a2841f226347c853559a58c3601d369b8a1ad))
* release-please-mark ([08b65a5](https://github.com/eslint-stylistic/eslint-stylistic/commit/08b65a5a605f4e86808983275370271548e98ec9))

## [2.10.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.9.0...v2.10.0) (2024-10-30)


### Features

* cross test `comma-spacing` ([#562](https://github.com/eslint-stylistic/eslint-stylistic/issues/562)) ([ea72317](https://github.com/eslint-stylistic/eslint-stylistic/commit/ea72317f548bf6904d10d7f415ce38dc04e454ff))
* **function-call-spacing:** auto-fix optional chain when option is `never` ([#589](https://github.com/eslint-stylistic/eslint-stylistic/issues/589)) ([7a2b47f](https://github.com/eslint-stylistic/eslint-stylistic/commit/7a2b47f9cfa32e311eea5b16b3a26c9d034f60df))
* **function-call-spacing:** support `ImportExpression` in `ts` version ([#570](https://github.com/eslint-stylistic/eslint-stylistic/issues/570)) ([19d1f8c](https://github.com/eslint-stylistic/eslint-stylistic/commit/19d1f8c4a4ae674c53adb4c908bd82985f9af6b9))
* **indent-binary-ops:** logical expression indent ([#576](https://github.com/eslint-stylistic/eslint-stylistic/issues/576)) ([cbf800d](https://github.com/eslint-stylistic/eslint-stylistic/commit/cbf800ddebf04b2439a751a5d773b80c498f504e))
* **indent:** add support for Import Attributes ([#579](https://github.com/eslint-stylistic/eslint-stylistic/issues/579)) ([4f944d8](https://github.com/eslint-stylistic/eslint-stylistic/commit/4f944d803f779194d76bbd8d9308cef2fb22d7ec))
* **key-spacing:** add support for Import Attributes ([#583](https://github.com/eslint-stylistic/eslint-stylistic/issues/583)) ([789d893](https://github.com/eslint-stylistic/eslint-stylistic/commit/789d8935de1f05c6f525017bbb55b2729cff55b2))
* **max-statements-per-line:** new option to allow specific statements ([#558](https://github.com/eslint-stylistic/eslint-stylistic/issues/558)) ([2ed4054](https://github.com/eslint-stylistic/eslint-stylistic/commit/2ed405430c52ee13b5eaf2754e7c6c178d4e79e5))
* **no-multi-spaces:** add support for Import Attributes ([#584](https://github.com/eslint-stylistic/eslint-stylistic/issues/584)) ([0da0713](https://github.com/eslint-stylistic/eslint-stylistic/commit/0da07139a6c8e65d0478db91b534498d9a6c9889))
* **padding-line-between-statements:** add support for multiline-export and singleline-export ([#582](https://github.com/eslint-stylistic/eslint-stylistic/issues/582)) ([2690a30](https://github.com/eslint-stylistic/eslint-stylistic/commit/2690a302d50b044a58f7143fd26cb4204ab7e19d))
* **quote-props:** add support for Import Attributes ([#581](https://github.com/eslint-stylistic/eslint-stylistic/issues/581)) ([4edfee2](https://github.com/eslint-stylistic/eslint-stylistic/commit/4edfee2c573214b8feec1e1f1c06835e5cdb626c))


### Bug Fixes

* correct the type of `quotes` in `customize` ([#590](https://github.com/eslint-stylistic/eslint-stylistic/issues/590)) ([b86c2df](https://github.com/eslint-stylistic/eslint-stylistic/commit/b86c2df9a4700bbe37dd2fbb6fe45dba904895f7))
* **function-call-spacing:** don't remove comments while auto-fixing ([#588](https://github.com/eslint-stylistic/eslint-stylistic/issues/588)) ([53b4a55](https://github.com/eslint-stylistic/eslint-stylistic/commit/53b4a55b6ddca27e8f1cebf90a8835dc383fd07b))
* **jsx-closing-bracket-location:** should not remove comment in jsx ([#566](https://github.com/eslint-stylistic/eslint-stylistic/issues/566)) ([e2ba8d5](https://github.com/eslint-stylistic/eslint-stylistic/commit/e2ba8d535884a4f997f22b42be0c3f5c0d4f1c64))


### Documentation

* **func-call-spacing:** fixing broken links ([#587](https://github.com/eslint-stylistic/eslint-stylistic/issues/587)) ([d3dbc22](https://github.com/eslint-stylistic/eslint-stylistic/commit/d3dbc22f89c6cf7c8e54feedb5b73a8b64e145e9))


### Chores

* replace deprecated api with new api ([#567](https://github.com/eslint-stylistic/eslint-stylistic/issues/567)) ([3db4870](https://github.com/eslint-stylistic/eslint-stylistic/commit/3db4870f56b5f999439987eb904361488e764cc6))

## [2.9.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.8.0...v2.9.0) (2024-10-05)


### Features

* add indent option tabLength to customize config ([#538](https://github.com/eslint-stylistic/eslint-stylistic/issues/538)) ([91a18e7](https://github.com/eslint-stylistic/eslint-stylistic/commit/91a18e7a1af7f46c0a125e93c68ac7bc5004d74d))
* **curly-newline:** add new rule ([#548](https://github.com/eslint-stylistic/eslint-stylistic/issues/548)) ([049c20e](https://github.com/eslint-stylistic/eslint-stylistic/commit/049c20e409eb69b19e2fa7434ca5b13276d8adf5))
* Improve indent in template literals ([#553](https://github.com/eslint-stylistic/eslint-stylistic/issues/553)) ([9130c94](https://github.com/eslint-stylistic/eslint-stylistic/commit/9130c94eff8a0c97dbee2057c4e9b5891339ce44))
* **jsx/jsx-closing-tag-location:** add location option to customize indentation ([#550](https://github.com/eslint-stylistic/eslint-stylistic/issues/550)) ([ae09edd](https://github.com/eslint-stylistic/eslint-stylistic/commit/ae09edda14304e85df1426a7eb79e68d4fd029ba))


### Bug Fixes

* **quotes:** only when allowTemplateLiterals set, allow template literals to avoid escape sequences ([#544](https://github.com/eslint-stylistic/eslint-stylistic/issues/544)) ([7e3a0d3](https://github.com/eslint-stylistic/eslint-stylistic/commit/7e3a0d3b1989e708e0bad9a6315c4a91c34a4948))


### Documentation

* typo ([#534](https://github.com/eslint-stylistic/eslint-stylistic/issues/534)) ([9573674](https://github.com/eslint-stylistic/eslint-stylistic/commit/9573674cb7a15885255a4c20f0e92a588886fabc))


### Chores

* cross test merged rules (rest)  ([#529](https://github.com/eslint-stylistic/eslint-stylistic/issues/529)) ([e9087d3](https://github.com/eslint-stylistic/eslint-stylistic/commit/e9087d3e5fd9f7966c86091a4349d7244ace1fc7))

## [2.8.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.7.2...v2.8.0) (2024-09-09)


### Features

* **indent:** indention inside TemplateLiteral always start at level one ([#528](https://github.com/eslint-stylistic/eslint-stylistic/issues/528)) ([d2f92c0](https://github.com/eslint-stylistic/eslint-stylistic/commit/d2f92c0a04292b05ddbc785c7803be8f94935f80))
* remove `@types/eslint` ([5ea3d6a](https://github.com/eslint-stylistic/eslint-stylistic/commit/5ea3d6ac78ffd269a14bb86b848b1b4a3c8ca1d1))


### Bug Fixes

* **indent-binary-ops:** improve nested handling, close [#530](https://github.com/eslint-stylistic/eslint-stylistic/issues/530) ([af1c21a](https://github.com/eslint-stylistic/eslint-stylistic/commit/af1c21a4666e3a3d927c05f5f977a37c1477640a))
* move spacing rules about `as` and `satisfies` from `type-annontation-spacing` to `keyword-spacing` ([#535](https://github.com/eslint-stylistic/eslint-stylistic/issues/535)) ([b89ae5e](https://github.com/eslint-stylistic/eslint-stylistic/commit/b89ae5e8f588fc68d59df7c5d7a14559d878c331))


### Documentation

* redirect rule docs, close [#532](https://github.com/eslint-stylistic/eslint-stylistic/issues/532) ([7b92cfd](https://github.com/eslint-stylistic/eslint-stylistic/commit/7b92cfd6f9de8deeef646112254addabaf54f4d5))

## [2.7.2](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.7.1...v2.7.2) (2024-08-30)


### Bug Fixes

* **types:** add missing type reference, close [#526](https://github.com/eslint-stylistic/eslint-stylistic/issues/526) ([47fddb0](https://github.com/eslint-stylistic/eslint-stylistic/commit/47fddb0f6ac7f6e45188eff4f28755885e317249))

## [2.7.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.7.0-beta.1...v2.7.1) (2024-08-29)


### Chores

* release-please-mark ([34148f4](https://github.com/eslint-stylistic/eslint-stylistic/commit/34148f41089bcdf9621a02bd62b28b3db94f56ac))
* release-please-mark ([4b2d7ba](https://github.com/eslint-stylistic/eslint-stylistic/commit/4b2d7baa01258ef4ec0d92267950ec9a2ceee62e))

## [2.7.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.7.0-beta.1...v2.7.0) (2024-08-29)


### Chores

* release-please-mark ([4b2d7ba](https://github.com/eslint-stylistic/eslint-stylistic/commit/4b2d7baa01258ef4ec0d92267950ec9a2ceee62e))

## [2.7.0-beta.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.7.0-beta.0...v2.7.0-beta.1) (2024-08-29)


### Build Related

* improve bundling ([bb187a8](https://github.com/eslint-stylistic/eslint-stylistic/commit/bb187a85b65d611a985f3b0da0f200d0711a2f6b))
* standalone build for main package ([971b534](https://github.com/eslint-stylistic/eslint-stylistic/commit/971b53481a21ce8aa801d2142c7843e0560e626d))


### Chores

* release-please-mark ([1ed4f7f](https://github.com/eslint-stylistic/eslint-stylistic/commit/1ed4f7f75faaf9b8e6d334f32505e5399b4702e1))

## [2.7.0-beta.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.5...v2.7.0-beta.0) (2024-08-29)


### Chores

* cross test merged rules (partial) ([#520](https://github.com/eslint-stylistic/eslint-stylistic/issues/520)) ([97448b9](https://github.com/eslint-stylistic/eslint-stylistic/commit/97448b9648206f0eb2230a17cf08f8014476ae13))
* make ts plugin self-contains ([#519](https://github.com/eslint-stylistic/eslint-stylistic/issues/519)) ([7c7301e](https://github.com/eslint-stylistic/eslint-stylistic/commit/7c7301e8f6844c833485542fc1eb3a1132d9c6c6))
* move code into one package ([#497](https://github.com/eslint-stylistic/eslint-stylistic/issues/497)) ([3a9535f](https://github.com/eslint-stylistic/eslint-stylistic/commit/3a9535fd35367b3d8ae5e2d63616c2b080395d3c))
* release-please-mark ([96dd0e1](https://github.com/eslint-stylistic/eslint-stylistic/commit/96dd0e1b66452387f4004e8a4c4ab3527fb04ebc))

## [2.6.5](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.4...v2.6.5) (2024-08-28)


### Bug Fixes

* **type-annotation-spacing:** consider spacing around `as` and `satisfies` operator ([#517](https://github.com/eslint-stylistic/eslint-stylistic/issues/517)) ([cf254a9](https://github.com/eslint-stylistic/eslint-stylistic/commit/cf254a9f00d504d2f433a937cfb25003083e2552))


### Documentation

* use new vscode codeActionsOnSave syntax ([#511](https://github.com/eslint-stylistic/eslint-stylistic/issues/511)) ([086b7f3](https://github.com/eslint-stylistic/eslint-stylistic/commit/086b7f342a5cdbd289e2327ddfc3bb71cb51ba62))

## [2.6.4](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.3...v2.6.4) (2024-08-15)


### Bug Fixes

* **configs:** should not ignore `templateLiteral` for `indent` ([3154799](https://github.com/eslint-stylistic/eslint-stylistic/commit/3154799d2dec1aab326ce787e2da233696e451b6))


### Chores

* alias for shared utils ([#510](https://github.com/eslint-stylistic/eslint-stylistic/issues/510)) ([6ea8368](https://github.com/eslint-stylistic/eslint-stylistic/commit/6ea83684cd558a8f9b77c17df31d39d30a669c69))
* move utils ([011f5fb](https://github.com/eslint-stylistic/eslint-stylistic/commit/011f5fb1a8b555e6ee96ec26ca3ace37198a1e4e))

## [2.6.3](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.2...v2.6.3) (2024-08-15)


### Bug Fixes

* add explicit `"type": "commonjs"` ([9d37124](https://github.com/eslint-stylistic/eslint-stylistic/commit/9d37124f9b5374c76d5a178928cb350b110dcfce))
* **arrow-parens:** wrong parens removal with optional parameter ([#499](https://github.com/eslint-stylistic/eslint-stylistic/issues/499)) ([71896ce](https://github.com/eslint-stylistic/eslint-stylistic/commit/71896ce0395f810d96e643f47e98ef3812a6dc05))
* **lines-between-class-members:** properly infer `exceptAfterOverload` from `enforce` ([#239](https://github.com/eslint-stylistic/eslint-stylistic/issues/239)) ([3dfa159](https://github.com/eslint-stylistic/eslint-stylistic/commit/3dfa1594c2b9e75e4a4260ca07d5f5c654204d18))
* **ts/padding-line-between-statements:** removing blank line between functions in interface ([#71](https://github.com/eslint-stylistic/eslint-stylistic/issues/71)) ([#468](https://github.com/eslint-stylistic/eslint-stylistic/issues/468)) ([91eb636](https://github.com/eslint-stylistic/eslint-stylistic/commit/91eb636c6eb8e6887ec67fb9ecaa2b24079ef16f))


### Chores

* move js utils out ([bc3a15d](https://github.com/eslint-stylistic/eslint-stylistic/commit/bc3a15dbbfbcb7ffa7527c9275ad852703492848))
* move utils ([60ef2ba](https://github.com/eslint-stylistic/eslint-stylistic/commit/60ef2ba54b2485bf9227b66fff826db96a7c31ba))
* share utils folder ([deb8178](https://github.com/eslint-stylistic/eslint-stylistic/commit/deb81783ca5132972b1da1fe2a91ad1d8ee4f8e3))
* **test:** replace the parsing result files with the real parser ([#505](https://github.com/eslint-stylistic/eslint-stylistic/issues/505)) ([bd6f8bc](https://github.com/eslint-stylistic/eslint-stylistic/commit/bd6f8bc19130e2bd4672b45abe1e180278f8535a))
* unify createRule ([#507](https://github.com/eslint-stylistic/eslint-stylistic/issues/507)) ([fc6e716](https://github.com/eslint-stylistic/eslint-stylistic/commit/fc6e716f154f30c786288a97a4343c1bc594edab))

## [2.6.2](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.1...v2.6.2) (2024-08-08)


### Bug Fixes

* **indent:** indentation for argument with decorators ([#487](https://github.com/eslint-stylistic/eslint-stylistic/issues/487)) ([aefb3be](https://github.com/eslint-stylistic/eslint-stylistic/commit/aefb3be36e53857e8ce7fb1a0d629d1dab11979b))
* **quotes:** ignore backtick in ts import types ([#493](https://github.com/eslint-stylistic/eslint-stylistic/issues/493)) ([a7f7c2a](https://github.com/eslint-stylistic/eslint-stylistic/commit/a7f7c2a900223570586740763487b674644560e2))


### Chores

* consistent `createRule` argument order ([83e22f2](https://github.com/eslint-stylistic/eslint-stylistic/commit/83e22f29e46603d103b50627c34620fa93226583))
* **indent:** simplify the code related to `PropertyDefinition` with decorators ([#489](https://github.com/eslint-stylistic/eslint-stylistic/issues/489)) ([53d731f](https://github.com/eslint-stylistic/eslint-stylistic/commit/53d731ff19ef25c8c4fbbab6db4b1f4a6270bdd2))

## [2.6.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.0...v2.6.1) (2024-08-01)


### Bug Fixes

* compatible with ts-eslint v7, close [#484](https://github.com/eslint-stylistic/eslint-stylistic/issues/484) ([c312fc7](https://github.com/eslint-stylistic/eslint-stylistic/commit/c312fc7a8b232353bd38b2ab0d2665a4f7851de5))

## [2.6.0](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.0-beta.1...v2.6.0) (2024-07-31)


### ⚠ BREAKING CHANGES

* requires Node `^18.18.0 || ^20.9.0 || >=21.1.0`, bump deps ([#337](https://github.com/eslint-stylistic/eslint-stylistic/issues/337))
* remove unused @stylistic/eslint-config package
* update migration rules list
* rework migrate package to support custom from from and to

### Features

* add `quotes`, `semi` and `comma-dangle` rules ([55ebf44](https://github.com/eslint-stylistic/eslint-stylistic/commit/55ebf443b12e424e47644c375c0115ed27490f65))
* add auto fix indicator on rule list ([#180](https://github.com/eslint-stylistic/eslint-stylistic/issues/180)) ([b37a8a6](https://github.com/eslint-stylistic/eslint-stylistic/commit/b37a8a652435128fa8a278ab8f0273fe3a703044))
* add doc comment for rule options ([#44](https://github.com/eslint-stylistic/eslint-stylistic/issues/44)) ([ecfb109](https://github.com/eslint-stylistic/eslint-stylistic/commit/ecfb1093d1395301df1dd9c31b1434dc854edec2))
* basic ts rules migration script ([8cc6daf](https://github.com/eslint-stylistic/eslint-stylistic/commit/8cc6daff985c979a9976c3cb3dce0185cd7dabad))
* bump `[@typescript-eslint](https://github.com/typescript-eslint)` to v8 ([#452](https://github.com/eslint-stylistic/eslint-stylistic/issues/452)) ([27d6b00](https://github.com/eslint-stylistic/eslint-stylistic/commit/27d6b0012801e472a26095708839b37d1e2b4a61))
* **configs:** add new options to customize config to assist with migrating from Prettier ([#224](https://github.com/eslint-stylistic/eslint-stylistic/issues/224)) ([d6b4167](https://github.com/eslint-stylistic/eslint-stylistic/commit/d6b4167f67823e9bbd23cc03face209d887de252))
* **configs:** enable extra rules in the configs factory ([#205](https://github.com/eslint-stylistic/eslint-stylistic/issues/205)) ([58f224f](https://github.com/eslint-stylistic/eslint-stylistic/commit/58f224fc4b02443f774625fc41625ea1db7b0193))
* define-config-support files ([#20](https://github.com/eslint-stylistic/eslint-stylistic/issues/20)) ([f9d0829](https://github.com/eslint-stylistic/eslint-stylistic/commit/f9d08299f28d2e4861dd15e9dcf1d5485118c522))
* dts for jsx ([a24f856](https://github.com/eslint-stylistic/eslint-stylistic/commit/a24f8566345a5ecf4d4504c95f07587099b6d19d))
* **eslint-plugin-jsx:** add jsx-self-closing-comp ([#22](https://github.com/eslint-stylistic/eslint-stylistic/issues/22)) ([93c5b52](https://github.com/eslint-stylistic/eslint-stylistic/commit/93c5b521b16f7777449cd4c6bfe18e78075c4c0d))
* **eslint-plugin:** bundle types ([e4b2677](https://github.com/eslint-stylistic/eslint-stylistic/commit/e4b26779578d05c5b668e45cc4ad53c55419239e))
* expose rule options ([6b4063b](https://github.com/eslint-stylistic/eslint-stylistic/commit/6b4063bffc45fd4d63e2f97a4dd1279df7b84eec))
* expose sub entries for each rule ([74748cb](https://github.com/eslint-stylistic/eslint-stylistic/commit/74748cbebb76f43d78da3b8180075d9ab79a77f3))
* further reduce deps size ([c0f887b](https://github.com/eslint-stylistic/eslint-stylistic/commit/c0f887b3f87066d810631d8d8b6bf34ba1b47c9a))
* improve type completeness ([43ff0bc](https://github.com/eslint-stylistic/eslint-stylistic/commit/43ff0bcb2fd72ed7d89a1642628b6d0c2d120823))
* **indent-binary-ops:** new rule ([#202](https://github.com/eslint-stylistic/eslint-stylistic/issues/202)) ([971662b](https://github.com/eslint-stylistic/eslint-stylistic/commit/971662b328d2492522887d7386f073072cb004dc))
* **indent:** support for JSXText indentation ([#413](https://github.com/eslint-stylistic/eslint-stylistic/issues/413)) ([a5b62a0](https://github.com/eslint-stylistic/eslint-stylistic/commit/a5b62a04d3b25d6144a5935f0ed9370487f26409))
* introduce `@stylistic/eslint-plugin-plus` ([#203](https://github.com/eslint-stylistic/eslint-stylistic/issues/203)) ([02b7384](https://github.com/eslint-stylistic/eslint-stylistic/commit/02b73849f4f4520d20c006181a1c13f93cfdc5c3))
* introduce `@stylistic/eslint-plugin` ([#11](https://github.com/eslint-stylistic/eslint-stylistic/issues/11)) ([d91f29f](https://github.com/eslint-stylistic/eslint-stylistic/commit/d91f29fb8232a1c32354ceb982c917d787c5b1d5))
* introduce `all-flat` and `all-extend` config option ([#168](https://github.com/eslint-stylistic/eslint-stylistic/issues/168)) ([ff2d865](https://github.com/eslint-stylistic/eslint-stylistic/commit/ff2d86599b491847bfa31aa5986b29eae389f0b7))
* introduce builtin config ([#149](https://github.com/eslint-stylistic/eslint-stylistic/issues/149)) ([2c9e61a](https://github.com/eslint-stylistic/eslint-stylistic/commit/2c9e61af1a165e21176fffd308403b2ed88dc5b4))
* introduce migrate rule ([a2dea27](https://github.com/eslint-stylistic/eslint-stylistic/commit/a2dea27a9577b8a06db9223dc6f8343cf8a17226))
* **js/array-element-newline:** options multiline and consistent combination ([#445](https://github.com/eslint-stylistic/eslint-stylistic/issues/445)) ([cfd3327](https://github.com/eslint-stylistic/eslint-stylistic/commit/cfd332766de15e9ab29e92c5048640a07f2f15bd))
* **js/no-multi-spaces:** new `includeTabs` option ([#195](https://github.com/eslint-stylistic/eslint-stylistic/issues/195)) ([be417a9](https://github.com/eslint-stylistic/eslint-stylistic/commit/be417a9a4b07adecf55bd4645722fcfe4e02d0b3))
* **js:** add option `ignoreStringLiterals` ([#401](https://github.com/eslint-stylistic/eslint-stylistic/issues/401)) ([1b6d563](https://github.com/eslint-stylistic/eslint-stylistic/commit/1b6d563921b408723fa9a5bd911f5890c698f649)), closes [#400](https://github.com/eslint-stylistic/eslint-stylistic/issues/400)
* **js:** port `multiline-comment-style` and `line-comment-position` ([#389](https://github.com/eslint-stylistic/eslint-stylistic/issues/389)) ([e3212fe](https://github.com/eslint-stylistic/eslint-stylistic/commit/e3212fe2e9daca4e1be69751654eb3c0c1176929))
* **jsx-function-call-newline:** add jsx-function-call-newline rule ([#376](https://github.com/eslint-stylistic/eslint-stylistic/issues/376)) ([110aa4c](https://github.com/eslint-stylistic/eslint-stylistic/commit/110aa4ccc33371e47943952e1b595d67239ef5dc))
* **jsx-one-expression-per-line:** allow `non-jsx` ([#393](https://github.com/eslint-stylistic/eslint-stylistic/issues/393)) ([431d564](https://github.com/eslint-stylistic/eslint-stylistic/commit/431d56475af2ba183421cb051e486b2bb6940169))
* **jsx-one-expression-per-line:** allow single line ([#377](https://github.com/eslint-stylistic/eslint-stylistic/issues/377)) ([f8825f2](https://github.com/eslint-stylistic/eslint-stylistic/commit/f8825f290cd049c07f17dd2fea16ffec6e532e39))
* **jsx-wrap-multilines:** supports adding parentheses and line breaks for object properties ([#372](https://github.com/eslint-stylistic/eslint-stylistic/issues/372)) ([c72d043](https://github.com/eslint-stylistic/eslint-stylistic/commit/c72d0437e4cf447918b0750200cf8fb6a46af2cf))
* **jsx/pascal-case:** new rule port from eslint-plugin-react ([#271](https://github.com/eslint-stylistic/eslint-stylistic/issues/271)) ([7a5b9ef](https://github.com/eslint-stylistic/eslint-stylistic/commit/7a5b9ef3789bd0e63bc5cbb63dcce5e1a62fe72a))
* migrate eslint rules ([4673a27](https://github.com/eslint-stylistic/eslint-stylistic/commit/4673a27aa94ca1d57a7e6aa4c8698a8fc4d138d7))
* migrate jsx rules ([#17](https://github.com/eslint-stylistic/eslint-stylistic/issues/17)) ([ecca1b7](https://github.com/eslint-stylistic/eslint-stylistic/commit/ecca1b73bd7512baf3b3642f226fd1bd9bc5c11a))
* migrate more rules ([ca8429d](https://github.com/eslint-stylistic/eslint-stylistic/commit/ca8429d0afbcf6a3edbf999a8c6fc50fe15c3361))
* migrate more rules, improve consistency ([753ee3e](https://github.com/eslint-stylistic/eslint-stylistic/commit/753ee3e25cf7d1d154fa18866ad28c3fb7bdeb2d))
* migrate to `@types/eslint` `v9.6.0` ([#479](https://github.com/eslint-stylistic/eslint-stylistic/issues/479)) ([ea72aae](https://github.com/eslint-stylistic/eslint-stylistic/commit/ea72aaedc94c8178aa338f563b717f33ffc713f7))
* migrate ts rules ([ca938b3](https://github.com/eslint-stylistic/eslint-stylistic/commit/ca938b3768d032f9641c7e622b69ada481e6aed7))
* **migrate:** add more targets ([3eabad8](https://github.com/eslint-stylistic/eslint-stylistic/commit/3eabad8f64805456aa13d434feb4207a744862db))
* **multiline-ternary:** add ignoreJSX option ([#280](https://github.com/eslint-stylistic/eslint-stylistic/issues/280)) ([c6b14ea](https://github.com/eslint-stylistic/eslint-stylistic/commit/c6b14ea916c179d6837d7c7474a4017b95854858))
* new `ts/quote-props` rule ([#275](https://github.com/eslint-stylistic/eslint-stylistic/issues/275)) ([a56b798](https://github.com/eslint-stylistic/eslint-stylistic/commit/a56b798e8d85be7273f5b2292b119743b2fa9b6c))
* partial migrate to ts ([#66](https://github.com/eslint-stylistic/eslint-stylistic/issues/66)) ([a88038e](https://github.com/eslint-stylistic/eslint-stylistic/commit/a88038ef8dcd854c79697381587a8932864b645c))
* provide `disable-legacy` config preset ([#69](https://github.com/eslint-stylistic/eslint-stylistic/issues/69)) ([d795225](https://github.com/eslint-stylistic/eslint-stylistic/commit/d79522523b012ff2a36681101cc7acc12ec461c0))
* publish `@eslint-stylistic/metadata` ([20b91be](https://github.com/eslint-stylistic/eslint-stylistic/commit/20b91beae6267621c932c47decdd00c8a7c1446c))
* rename `func-call-spacing` to `function-call-spacing`, provide back alias ([#63](https://github.com/eslint-stylistic/eslint-stylistic/issues/63)) ([95b6001](https://github.com/eslint-stylistic/eslint-stylistic/commit/95b60014bc7285bfe0dc440d0835847435b3f99d))
* replace `graphemer` with `Intl.Segmenter` ([#220](https://github.com/eslint-stylistic/eslint-stylistic/issues/220)) ([e09f2aa](https://github.com/eslint-stylistic/eslint-stylistic/commit/e09f2aa0e5186ad4dbbd7036bb13c2fc74880537))
* requires Node `^18.18.0 || ^20.9.0 || &gt;=21.1.0`, bump deps ([#337](https://github.com/eslint-stylistic/eslint-stylistic/issues/337)) ([300ce2c](https://github.com/eslint-stylistic/eslint-stylistic/commit/300ce2cdf3154dcfd139e60546234ec8fd2620d2))
* rework migrate package to support custom from from and to ([f3a9013](https://github.com/eslint-stylistic/eslint-stylistic/commit/f3a901381009cf435ad33c5068d5b66a2a2467e9))
* **spaced-comment:** ignore typescript triple-slash directive ([#294](https://github.com/eslint-stylistic/eslint-stylistic/issues/294)) ([9d1b285](https://github.com/eslint-stylistic/eslint-stylistic/commit/9d1b285b452e51d062c101dd6ecdef0c62f0ec4f))
* support eslint-define-config rules ([#14](https://github.com/eslint-stylistic/eslint-stylistic/issues/14)) ([9d5ef1f](https://github.com/eslint-stylistic/eslint-stylistic/commit/9d5ef1feb8385491661414509dc7900b6c1b6610))
* **ts/lines-around-comment:** add missing `afterHashbangComment` in schema, fix [#75](https://github.com/eslint-stylistic/eslint-stylistic/issues/75) ([#161](https://github.com/eslint-stylistic/eslint-stylistic/issues/161)) ([391335b](https://github.com/eslint-stylistic/eslint-stylistic/commit/391335b84ba01539cd99017262786f9a7c0e26e1))
* **ts:** add `object-curly-newline` and `object-property-newline` ([#444](https://github.com/eslint-stylistic/eslint-stylistic/issues/444)) ([036d3de](https://github.com/eslint-stylistic/eslint-stylistic/commit/036d3de3a02e86dde21b01369f98521571cd4273))
* **ts:** slim dependencies ([af4098a](https://github.com/eslint-stylistic/eslint-stylistic/commit/af4098a97cd9bf9baf65c62a921d53292874359c))
* **type-generic-spacing:** new rule ([#200](https://github.com/eslint-stylistic/eslint-stylistic/issues/200)) ([1a8719f](https://github.com/eslint-stylistic/eslint-stylistic/commit/1a8719fbbe3cbf9687e88118089230be2902b642))
* **type-named-tuple-spacing:** new rule ([#201](https://github.com/eslint-stylistic/eslint-stylistic/issues/201)) ([8a66aaa](https://github.com/eslint-stylistic/eslint-stylistic/commit/8a66aaa6085c395ed1bada05822263520413583b))
* update migration rules list ([e3de97f](https://github.com/eslint-stylistic/eslint-stylistic/commit/e3de97f80fd402e96e30b0589aac9df687c2aeb0))
* update types generation script ([0e368ba](https://github.com/eslint-stylistic/eslint-stylistic/commit/0e368ba0a9b464c240ac09ccf6ac2c43db921044))


### Bug Fixes

* add `@types/eslint` as dependencies explicitly, fix [#276](https://github.com/eslint-stylistic/eslint-stylistic/issues/276) ([94097c9](https://github.com/eslint-stylistic/eslint-stylistic/commit/94097c96a5dc83922d8e9f7418905660600b923c))
* **comma-dangle:** only add comma when it's in brackets, fix [#158](https://github.com/eslint-stylistic/eslint-stylistic/issues/158) ([#160](https://github.com/eslint-stylistic/eslint-stylistic/issues/160)) ([b346087](https://github.com/eslint-stylistic/eslint-stylistic/commit/b34608703ef50c7a06c9c85d8c157e04e0c1e68b))
* **configs:** improve fixture testing, update `all` config to improve compatibility ([#204](https://github.com/eslint-stylistic/eslint-stylistic/issues/204)) ([5fb1826](https://github.com/eslint-stylistic/eslint-stylistic/commit/5fb1826251a33f960bc1b2a97f0f97e300e203e8))
* **configs:** member-delimiter-style should use semi delimiters when semi is true, fix [#266](https://github.com/eslint-stylistic/eslint-stylistic/issues/266) ([#267](https://github.com/eslint-stylistic/eslint-stylistic/issues/267)) ([7701a2a](https://github.com/eslint-stylistic/eslint-stylistic/commit/7701a2ad3c28327020cf57b8e5923c0aa4ac8715))
* docs link ([#21](https://github.com/eslint-stylistic/eslint-stylistic/issues/21)) ([b06bf8f](https://github.com/eslint-stylistic/eslint-stylistic/commit/b06bf8f096904119b4d9b80993eace01dcdfc817))
* **eslint-plugin:** dts path typo, close [#181](https://github.com/eslint-stylistic/eslint-stylistic/issues/181) ([67a716b](https://github.com/eslint-stylistic/eslint-stylistic/commit/67a716b03224e20b3cddbe3d0d9c71b83b55e5de))
* **eslint-plugin:** rename config `recommended-legacy` to `recommended-extends` ([#166](https://github.com/eslint-stylistic/eslint-stylistic/issues/166)) ([303d65b](https://github.com/eslint-stylistic/eslint-stylistic/commit/303d65b5e8aadb374792b4abd5ea25a778f6ccfa))
* **eslint-plugin:** type declaration path ([3b17090](https://github.com/eslint-stylistic/eslint-stylistic/commit/3b17090c8b04b05167eed74ab67ee296a4e917b6))
* exports meta ([c1d4d7a](https://github.com/eslint-stylistic/eslint-stylistic/commit/c1d4d7a63674e6cd8e5838eb10714531e5bc5f0b))
* Graphemer CJS interop, close [#216](https://github.com/eslint-stylistic/eslint-stylistic/issues/216) ([9ca6cb0](https://github.com/eslint-stylistic/eslint-stylistic/commit/9ca6cb08c03bffd69583dd29db5bcec863978507))
* **indent-binary-ops:** do not increase indent on `typeof` and `instanceof`, fix [#222](https://github.com/eslint-stylistic/eslint-stylistic/issues/222) ([#246](https://github.com/eslint-stylistic/eslint-stylistic/issues/246)) ([8f34543](https://github.com/eslint-stylistic/eslint-stylistic/commit/8f34543670e7add26e80ecd4c7d3582b752ea108))
* **indent-binary-ops:** should not increase indent with `this`, close [#268](https://github.com/eslint-stylistic/eslint-stylistic/issues/268) ([5d2c1d7](https://github.com/eslint-stylistic/eslint-stylistic/commit/5d2c1d7dfb366fcc4186b68187709657d2dc702c))
* **indent:** correct class property initialization ([#431](https://github.com/eslint-stylistic/eslint-stylistic/issues/431)) ([09ea5b0](https://github.com/eslint-stylistic/eslint-stylistic/commit/09ea5b0fdccc3f8585cfaf574914f4f9c2109d5d))
* **indent:** correct indentation for `PropertyDefinition` with decorators ([#416](https://github.com/eslint-stylistic/eslint-stylistic/issues/416)) ([4b4d27c](https://github.com/eslint-stylistic/eslint-stylistic/commit/4b4d27c0ede2bada33aab5cb9fcdca7e77448b8a))
* **indent:** correct indentation in chained methods calls with generics ([#424](https://github.com/eslint-stylistic/eslint-stylistic/issues/424)) ([4ba8b08](https://github.com/eslint-stylistic/eslint-stylistic/commit/4ba8b0866e602dd416d367d6435c747d594bbe97))
* **indent:** correctly identify opening brace on enum declaration ([#261](https://github.com/eslint-stylistic/eslint-stylistic/issues/261)) ([3c79437](https://github.com/eslint-stylistic/eslint-stylistic/commit/3c79437c7e9511e1b9d03ef2240a035cc141f430))
* **indent:** handle mixed spaces and tabs ([#465](https://github.com/eslint-stylistic/eslint-stylistic/issues/465)) ([d5ae88d](https://github.com/eslint-stylistic/eslint-stylistic/commit/d5ae88d6602f0e506872d06ef3dd1b4e6443638e))
* **indent:** handle undefined `node.decorators` when tsParser is not configured ([#422](https://github.com/eslint-stylistic/eslint-stylistic/issues/422)) ([3d63054](https://github.com/eslint-stylistic/eslint-stylistic/commit/3d63054ca962a00cdc5a3b4406daac97e7b94371))
* **js/function-paren-newline:** prevent newline error in type parameter ([#207](https://github.com/eslint-stylistic/eslint-stylistic/issues/207)) ([c37f3fe](https://github.com/eslint-stylistic/eslint-stylistic/commit/c37f3fea16917fa9aebdf89316cc2015a401dbd2))
* **js:** rules import, close [#9](https://github.com/eslint-stylistic/eslint-stylistic/issues/9) ([59110cf](https://github.com/eslint-stylistic/eslint-stylistic/commit/59110cf16f16987d9ab45fb7ffc1327a86945319))
* **jsx-indent:** conflict between indent and jsx-indent ([#368](https://github.com/eslint-stylistic/eslint-stylistic/issues/368)) ([7313184](https://github.com/eslint-stylistic/eslint-stylistic/commit/731318474fd5c7b0abe7f21abcb7334949bafc2e))
* **jsx-indent:** deprecate `jsx-indent` rule in favor of `indent` ([#447](https://github.com/eslint-stylistic/eslint-stylistic/issues/447)) ([57dd2e8](https://github.com/eslint-stylistic/eslint-stylistic/commit/57dd2e8b5927e6f9de019fff6e83cac4989de7ce))
* **jsx-one-expression-per-line:** only one line break has not been processed ([#384](https://github.com/eslint-stylistic/eslint-stylistic/issues/384)) ([a297f84](https://github.com/eslint-stylistic/eslint-stylistic/commit/a297f8434894fab99c5a2792477a8f9818aa3031))
* **jsx:** remove deprecated `jsx-space-before-closing`, close [#18](https://github.com/eslint-stylistic/eslint-stylistic/issues/18) ([c6961ed](https://github.com/eslint-stylistic/eslint-stylistic/commit/c6961ed33e67511d109e3d878a7fc18a0c7e0412))
* keep the plugin reference, close [#281](https://github.com/eslint-stylistic/eslint-stylistic/issues/281) ([68b2c8b](https://github.com/eslint-stylistic/eslint-stylistic/commit/68b2c8bfe60d8f2571a751487a3c8964cdce8492))
* **keyword-spacing:** fix regression, close [#156](https://github.com/eslint-stylistic/eslint-stylistic/issues/156) ([4523ce0](https://github.com/eslint-stylistic/eslint-stylistic/commit/4523ce0d3e22ffcc5c47d99812cfc3d78d776c03))
* make plugin assignable to ESLint.Plugin ([#418](https://github.com/eslint-stylistic/eslint-stylistic/issues/418)) ([9887ead](https://github.com/eslint-stylistic/eslint-stylistic/commit/9887ead9ae485fa8393e2f7b529074bf04200867))
* **padding-line-between-statements:** recognize ExportAllDeclaration nodes ([#257](https://github.com/eslint-stylistic/eslint-stylistic/issues/257)) ([52f0506](https://github.com/eslint-stylistic/eslint-stylistic/commit/52f0506263447a92369188962685700103275b5a))
* **plus/indent-binary-ops:** considring `||` and `&&` ([#430](https://github.com/eslint-stylistic/eslint-stylistic/issues/430)) ([9627a10](https://github.com/eslint-stylistic/eslint-stylistic/commit/9627a10af0e873475b0a90fef289a45033370df3))
* **quotes:** allow template literals to avoid escape sequences ([#410](https://github.com/eslint-stylistic/eslint-stylistic/issues/410)) ([1891c5f](https://github.com/eslint-stylistic/eslint-stylistic/commit/1891c5fd8ae3580b892694836c2a387070de2084))
* remove `ts/comma-dangle` rule ([f14d8cc](https://github.com/eslint-stylistic/eslint-stylistic/commit/f14d8ccf8823ee7f745830bfc4388d514e17ce25))
* remove duplicate rule in `all` configs ([#199](https://github.com/eslint-stylistic/eslint-stylistic/issues/199)) ([01eee11](https://github.com/eslint-stylistic/eslint-stylistic/commit/01eee11001a89c645af7035f83a1913c02f20087))
* remove unused @stylistic/eslint-config package ([4590100](https://github.com/eslint-stylistic/eslint-stylistic/commit/45901007e9d4b683fbd892ddb0fae0eee3935225))
* revert espree version bump, fix [#278](https://github.com/eslint-stylistic/eslint-stylistic/issues/278) ([470bcb2](https://github.com/eslint-stylistic/eslint-stylistic/commit/470bcb23cdbd86108009a64a9e5e64fff2828754))
* single schema dts generation ([#29](https://github.com/eslint-stylistic/eslint-stylistic/issues/29)) ([66bcc4a](https://github.com/eslint-stylistic/eslint-stylistic/commit/66bcc4a3a209fe3ac0e169e2ae587f0ccb6e4b78))
* **ts/comma-dangle:** allow tailing comma in generic in TSX ([#167](https://github.com/eslint-stylistic/eslint-stylistic/issues/167)) ([6fb4a9a](https://github.com/eslint-stylistic/eslint-stylistic/commit/6fb4a9ab4df5abb1b50b9ef0d723fda27e42e8bf))
* **ts/indent:** indentation of multiline type parameter instantiations ([#256](https://github.com/eslint-stylistic/eslint-stylistic/issues/256)) ([0ef56c7](https://github.com/eslint-stylistic/eslint-stylistic/commit/0ef56c76ab0ce64b5668bd8ba43e753f5244685a))
* **ts/no-extra-parens:** cover more unnecessary parens case ([#217](https://github.com/eslint-stylistic/eslint-stylistic/issues/217)) ([1a7fdaa](https://github.com/eslint-stylistic/eslint-stylistic/commit/1a7fdaa3d6f854d63a04231c640eb2687fcc7112))
* **ts/padding-line-between-statements:** add new `function-overload` statement type, close [#190](https://github.com/eslint-stylistic/eslint-stylistic/issues/190) ([#213](https://github.com/eslint-stylistic/eslint-stylistic/issues/213)) ([3229635](https://github.com/eslint-stylistic/eslint-stylistic/commit/3229635dfdb4d2fd007fb11338ae98e488094c0f))
* **ts/padding-line-between-statements:** support `cjs-import` and `cjs-export` statement type ([#162](https://github.com/eslint-stylistic/eslint-stylistic/issues/162)) ([58aace6](https://github.com/eslint-stylistic/eslint-stylistic/commit/58aace64e6b1bada4ce132b691430ed835534f15))
* **ts/quotes:** allow backtick literals, but forbid backtick import assertions ([#191](https://github.com/eslint-stylistic/eslint-stylistic/issues/191)) ([59ff2a2](https://github.com/eslint-stylistic/eslint-stylistic/commit/59ff2a2eebe27abe5047de7ed62b64d2e6025e43))
* **ts:** add migrate missing `no-extra-parens` and `no-extra-semi`, close [#34](https://github.com/eslint-stylistic/eslint-stylistic/issues/34) ([62846d2](https://github.com/eslint-stylistic/eslint-stylistic/commit/62846d239d50f4b60e4e72ef62acdc2489b2db02))
* **ts:** chunk bundling ([a278468](https://github.com/eslint-stylistic/eslint-stylistic/commit/a27846842778970d2a1d9d91799aec8e233fc840))
* type error on `UnprefixedRuleOptions` ([#284](https://github.com/eslint-stylistic/eslint-stylistic/issues/284)) ([f7bc3a9](https://github.com/eslint-stylistic/eslint-stylistic/commit/f7bc3a98174db964890206f74cb5594315bf3efb))
* **type-generic-spacing:** consider parentheses ([#467](https://github.com/eslint-stylistic/eslint-stylistic/issues/467)) ([fd08dd8](https://github.com/eslint-stylistic/eslint-stylistic/commit/fd08dd862081d34094423441115f39d7013b6464))
* types dist ([1567174](https://github.com/eslint-stylistic/eslint-stylistic/commit/15671745bcad86e2e994780306a7878fddaadb4d))
* types strictness, enable typecheck in ci, close [#64](https://github.com/eslint-stylistic/eslint-stylistic/issues/64) ([#65](https://github.com/eslint-stylistic/eslint-stylistic/issues/65)) ([2e44cab](https://github.com/eslint-stylistic/eslint-stylistic/commit/2e44cababb5b18192657ba3c458867f42bdd81f8))
* update metadata ([d5e9507](https://github.com/eslint-stylistic/eslint-stylistic/commit/d5e950755eb5fdb3c6b54fec652d9b68341a4c0f))
* update metadata, close [#31](https://github.com/eslint-stylistic/eslint-stylistic/issues/31) ([a04b0f0](https://github.com/eslint-stylistic/eslint-stylistic/commit/a04b0f0e682d3e9f7f2f8085c0c09fed0a2969f4))


### Documentation

* add auto-format FAQ item for JetBrains ([#30](https://github.com/eslint-stylistic/eslint-stylistic/issues/30)) ([c6f52cf](https://github.com/eslint-stylistic/eslint-stylistic/commit/c6f52cfca7a00d7a06531c076b6aa8bf809c4855))
* add codecov badge ([699103b](https://github.com/eslint-stylistic/eslint-stylistic/commit/699103b6d6c3f71861f4d01c1c92230b43cc99ac))
* add config as comments within documentations examples ([#175](https://github.com/eslint-stylistic/eslint-stylistic/issues/175)) ([af433a8](https://github.com/eslint-stylistic/eslint-stylistic/commit/af433a8b719076fad657457a4a2adb3b3045f04e))
* add contribution guide ([9854849](https://github.com/eslint-stylistic/eslint-stylistic/commit/98548494ba02032786ae7218c42b0f8c869603d8))
* add discord link ([3634014](https://github.com/eslint-stylistic/eslint-stylistic/commit/3634014fad433a1fd565a3c084b4f8ec84be091e))
* add faq ([1ad3e90](https://github.com/eslint-stylistic/eslint-stylistic/commit/1ad3e904687bf892782221fbf32f328810e0ff41))
* add flat config example, close [#230](https://github.com/eslint-stylistic/eslint-stylistic/issues/230) ([de02f00](https://github.com/eslint-stylistic/eslint-stylistic/commit/de02f0008a8293c44f7d77270a927cdfa936ed46))
* add flat config versions for Migrate to 1-to-1 Plugins ([#435](https://github.com/eslint-stylistic/eslint-stylistic/issues/435)) ([d670924](https://github.com/eslint-stylistic/eslint-stylistic/commit/d6709241555f6acd34c52325c3a044f32f1b8241))
* add generated comment ([b173010](https://github.com/eslint-stylistic/eslint-stylistic/commit/b173010ed39b01edec3346fca55388427cd27e34))
* add guideline about adding new rule ([#176](https://github.com/eslint-stylistic/eslint-stylistic/issues/176)) ([330a859](https://github.com/eslint-stylistic/eslint-stylistic/commit/330a859e02c8aa70d087b312700a58eb2321ff68))
* add issue template for reporting bugs ([#157](https://github.com/eslint-stylistic/eslint-stylistic/issues/157)) ([9542da2](https://github.com/eslint-stylistic/eslint-stylistic/commit/9542da208b95aae7caad1b0ea6693c5d6822e5bd))
* add local search and edit page links ([#38](https://github.com/eslint-stylistic/eslint-stylistic/issues/38)) ([7f37537](https://github.com/eslint-stylistic/eslint-stylistic/commit/7f37537ff53ba0a25fbfa77e2f7c2c3491c07ab8))
* add more categories ([98fe245](https://github.com/eslint-stylistic/eslint-stylistic/commit/98fe2458783a08bab32f42e9b7c46f85d95fa673))
* add more filters ([c1c772e](https://github.com/eslint-stylistic/eslint-stylistic/commit/c1c772ec09ff4133c618a48db44ba03a900e68a7))
* add more project stages ([b034f31](https://github.com/eslint-stylistic/eslint-stylistic/commit/b034f3165d47a4df17f7dc4d8d178688382ee16e))
* add npm downloads badge ([706cef2](https://github.com/eslint-stylistic/eslint-stylistic/commit/706cef2909aa883893d9be34981fd84ca2ee07e9))
* add playground ([3b26cee](https://github.com/eslint-stylistic/eslint-stylistic/commit/3b26ceecf0b34d36d68063019b77395bdabbcff3))
* add rules search ([1cc9a10](https://github.com/eslint-stylistic/eslint-stylistic/commit/1cc9a10306dbfad943dedcff010ac447dbca9d0e))
* add terminology, close [#19](https://github.com/eslint-stylistic/eslint-stylistic/issues/19) ([c19255b](https://github.com/eslint-stylistic/eslint-stylistic/commit/c19255b60d183d2961cd9ff503ca206390bfd1b1))
* add why section ([5d14de4](https://github.com/eslint-stylistic/eslint-stylistic/commit/5d14de40d90c96dfe4673fd47575f36ff15af976))
* adding TS section to the default rule docs, close [#178](https://github.com/eslint-stylistic/eslint-stylistic/issues/178) ([9755d80](https://github.com/eslint-stylistic/eslint-stylistic/commit/9755d80a661229296ad89bc5e819a37edd489822))
* address some general grammar issues ([#32](https://github.com/eslint-stylistic/eslint-stylistic/issues/32)) ([dc7dc05](https://github.com/eslint-stylistic/eslint-stylistic/commit/dc7dc057b88cd67e7328a99ab95e5cd942d7b9fe))
* apply @JoshuaKGoldberg's suggestions ([32f1e27](https://github.com/eslint-stylistic/eslint-stylistic/commit/32f1e2770bd4543fdf04731872a9199b608df61b))
* basic package index ([065ad36](https://github.com/eslint-stylistic/eslint-stylistic/commit/065ad3655cfccd525ead93867e95b6b3ea3fc0fe))
* clean up docs ([a037c2f](https://github.com/eslint-stylistic/eslint-stylistic/commit/a037c2f5bd0953cae2266fcbfa656117b657993b))
* correct eslint requirement to `8.40.0` ([#177](https://github.com/eslint-stylistic/eslint-stylistic/issues/177)) ([2e75cfb](https://github.com/eslint-stylistic/eslint-stylistic/commit/2e75cfbff6446d68d67b99d6538099d794b60268))
* create CODE_OF_CONDUCT.md ([d3d8a4e](https://github.com/eslint-stylistic/eslint-stylistic/commit/d3d8a4ebdc26ca59a53639c41b7cabb4114eeef2))
* custom block ([a7e3de2](https://github.com/eslint-stylistic/eslint-stylistic/commit/a7e3de26a7c4982dda511cfc74cfeacbad277989))
* fix "Contributing" link ([#383](https://github.com/eslint-stylistic/eslint-stylistic/issues/383)) ([c89125f](https://github.com/eslint-stylistic/eslint-stylistic/commit/c89125f7e81cfb5ebce37ce65bfdba726456574a))
* fix `function-call-spacing` docs ([#74](https://github.com/eslint-stylistic/eslint-stylistic/issues/74)) ([641cd48](https://github.com/eslint-stylistic/eslint-stylistic/commit/641cd48d2152b830eeb70aca64248409a0181728))
* fix 404 page cant match ([#16](https://github.com/eslint-stylistic/eslint-stylistic/issues/16)) ([15033f2](https://github.com/eslint-stylistic/eslint-stylistic/commit/15033f25790fff2b0af2b2bbea1719561531f91e))
* fix broken link in ts/lines-between-class-members rule ([#385](https://github.com/eslint-stylistic/eslint-stylistic/issues/385)) ([594a860](https://github.com/eslint-stylistic/eslint-stylistic/commit/594a860b25ae032d11dddf0cf1303d3ee6d3c934))
* fix grammar issues and improve writing ([#50](https://github.com/eslint-stylistic/eslint-stylistic/issues/50)) ([fe1d443](https://github.com/eslint-stylistic/eslint-stylistic/commit/fe1d443300b1db098b81291da26446bc6eb7b252))
* fix indentation in jsx.md ([#434](https://github.com/eslint-stylistic/eslint-stylistic/issues/434)) ([578fce1](https://github.com/eslint-stylistic/eslint-stylistic/commit/578fce1a7311a5ae25fa4781577b25c3df5b64c7))
* fix link ([#379](https://github.com/eslint-stylistic/eslint-stylistic/issues/379)) ([5060350](https://github.com/eslint-stylistic/eslint-stylistic/commit/5060350fe3ecc3acd7fae83eb45cbd4de9c06fb5))
* fix link to selectors ([#345](https://github.com/eslint-stylistic/eslint-stylistic/issues/345)) ([54bafb7](https://github.com/eslint-stylistic/eslint-stylistic/commit/54bafb76c43bb8e808b5019f5d9e9e8a4e0ee387))
* fix note block display ([#471](https://github.com/eslint-stylistic/eslint-stylistic/issues/471)) ([28db32c](https://github.com/eslint-stylistic/eslint-stylistic/commit/28db32cb894cb1f7a70eaa0ef5f162aaaf1cf08c))
* fix sidebar ([f299f98](https://github.com/eslint-stylistic/eslint-stylistic/commit/f299f985aa54508159ddba4b8e76598e1fed2fca))
* fix typo ([#10](https://github.com/eslint-stylistic/eslint-stylistic/issues/10)) ([8b687f0](https://github.com/eslint-stylistic/eslint-stylistic/commit/8b687f00a71404730e0d509c08b65c70644e17d1))
* fix typo ([#212](https://github.com/eslint-stylistic/eslint-stylistic/issues/212)) ([97a7554](https://github.com/eslint-stylistic/eslint-stylistic/commit/97a7554fda0a91d05efd70f363a79f2a4f0b5841))
* fix typo in migration.md ([#432](https://github.com/eslint-stylistic/eslint-stylistic/issues/432)) ([fc38d86](https://github.com/eslint-stylistic/eslint-stylistic/commit/fc38d86faa632807aa869f2e2906ea133c487558))
* fix typo in why.md ([#6](https://github.com/eslint-stylistic/eslint-stylistic/issues/6)) ([21a8fb0](https://github.com/eslint-stylistic/eslint-stylistic/commit/21a8fb0d68ccfd1a7a7976c72e1390d87785f7c6))
* fix typos in why.md ([#3](https://github.com/eslint-stylistic/eslint-stylistic/issues/3)) ([64afb54](https://github.com/eslint-stylistic/eslint-stylistic/commit/64afb54cb3243e233223f30424d48a02191dda7e))
* fixes typo in why.md ([#7](https://github.com/eslint-stylistic/eslint-stylistic/issues/7)) ([c5596a9](https://github.com/eslint-stylistic/eslint-stylistic/commit/c5596a95e907e34a201e49aa39f1af63a985f447))
* generate rules.md ([4f34391](https://github.com/eslint-stylistic/eslint-stylistic/commit/4f34391ea276ef2ddecc80eae6b1e5ee41a1b1cf))
* how to see lint results in reproduction ([#169](https://github.com/eslint-stylistic/eslint-stylistic/issues/169)) ([d43105b](https://github.com/eslint-stylistic/eslint-stylistic/commit/d43105b4dadcd599d1c8fd10aceb24c283cb208c))
* improve default value explanation for shared config, close [#163](https://github.com/eslint-stylistic/eslint-stylistic/issues/163) ([9996a21](https://github.com/eslint-stylistic/eslint-stylistic/commit/9996a21cf51a9586d4ce541995f7debea3286f94))
* improve docs ([6c8f7fd](https://github.com/eslint-stylistic/eslint-stylistic/commit/6c8f7fdbc611b4610ff629960e58d2991db4cbe6))
* improve docs ([dc897ec](https://github.com/eslint-stylistic/eslint-stylistic/commit/dc897ec6f69e780df2eb7c4905770ed764932b81))
* improve docs search, close [#381](https://github.com/eslint-stylistic/eslint-stylistic/issues/381) ([d0df679](https://github.com/eslint-stylistic/eslint-stylistic/commit/d0df679403645bfddceb629bb35284bb9ae0a38a))
* improve guide on create reproduction ([359fd33](https://github.com/eslint-stylistic/eslint-stylistic/commit/359fd33ea8afb946a08caa39fc64b6e570a22c4e))
* improve issue template ([435d246](https://github.com/eslint-stylistic/eslint-stylistic/commit/435d2465ed13da9dd9b1cd98183ee9f1c7d8d6a7))
* improve migration guide ([524e66f](https://github.com/eslint-stylistic/eslint-stylistic/commit/524e66fdf0803dc49a1991eec998adeaaac4508b))
* improve packages experience ([55ac101](https://github.com/eslint-stylistic/eslint-stylistic/commit/55ac1013f68e3e6874d54824b5bcd915874eb3b0))
* improve wordings for shared-config page ([59fa37d](https://github.com/eslint-stylistic/eslint-stylistic/commit/59fa37dc91e38f4b6cfcee84bbfeab63eda76cf1))
* increase memory ([1077846](https://github.com/eslint-stylistic/eslint-stylistic/commit/1077846d62b7d7469f7dd4d8ef967733e4d5a9d6))
* **indent-binary-ops:** improve docs, close [#226](https://github.com/eslint-stylistic/eslint-stylistic/issues/226) ([9133c1b](https://github.com/eslint-stylistic/eslint-stylistic/commit/9133c1b7dc207197e61c70816892b8d199448591))
* interactive rules categories and dedicated rules page ([571b3c5](https://github.com/eslint-stylistic/eslint-stylistic/commit/571b3c59b3e7c2dd79a239de753290e04a4a7ad7))
* **jsx:** update docs url ([c6e12e5](https://github.com/eslint-stylistic/eslint-stylistic/commit/c6e12e504459f14eb1c86d07824dd5487a8b1670))
* linting for markdown ([df8dcf5](https://github.com/eslint-stylistic/eslint-stylistic/commit/df8dcf5c01553dcdafb3caeffe817de9c92a61db))
* markdown transform to inject title ([2d43059](https://github.com/eslint-stylistic/eslint-stylistic/commit/2d4305907aa580bbb1924aeffd87dc44dda9206f))
* merge nav items ([7b47ff8](https://github.com/eslint-stylistic/eslint-stylistic/commit/7b47ff8a267fc6c54ca4105be16501af67d2a06c))
* **migrate:** docs for migrate plugin ([b64a137](https://github.com/eslint-stylistic/eslint-stylistic/commit/b64a1379ac6e0a8ae4c6004058f230f01607b5cb))
* missing option `includeTabs` of rule `no-multi-spaces` ([#237](https://github.com/eslint-stylistic/eslint-stylistic/issues/237)) ([b7cfa0a](https://github.com/eslint-stylistic/eslint-stylistic/commit/b7cfa0a44c534ab213b8efccf2118c069e4982f7))
* **no-mixed-operators:** clarify rule behavior for parameter 'groups' ([#302](https://github.com/eslint-stylistic/eslint-stylistic/issues/302)) ([cd02cea](https://github.com/eslint-stylistic/eslint-stylistic/commit/cd02cea85ce3cafee1d8bf5f3b4dfa9bee920542))
* notice about shared configs version policy ([50b36ab](https://github.com/eslint-stylistic/eslint-stylistic/commit/50b36abc677572bf6ce536e1ecccf74ace80b0c0))
* redirect curly to eslint page ([#309](https://github.com/eslint-stylistic/eslint-stylistic/issues/309)) ([4d0e78e](https://github.com/eslint-stylistic/eslint-stylistic/commit/4d0e78ecc222d7af39c01fdd95d08d5af7491754))
* rename contribute guide ([56cf79f](https://github.com/eslint-stylistic/eslint-stylistic/commit/56cf79fb6a4e959e85a597f458ff7666e96acdf2))
* render whitespaces in code snippet ([#182](https://github.com/eslint-stylistic/eslint-stylistic/issues/182)) ([e54fecb](https://github.com/eslint-stylistic/eslint-stylistic/commit/e54fecbb8bec59d662501792bea6d4e244e834bb))
* show recommended meta for rules ([#288](https://github.com/eslint-stylistic/eslint-stylistic/issues/288)) ([f0cde51](https://github.com/eslint-stylistic/eslint-stylistic/commit/f0cde51e997526715e62b8aecad32009ed5b90f3))
* show red underlines in examples in rules docs ([#273](https://github.com/eslint-stylistic/eslint-stylistic/issues/273)) ([a4296ea](https://github.com/eslint-stylistic/eslint-stylistic/commit/a4296ea5eb152b1636ac418a3cf88e864cb30142))
* specify the Node engine and ESLint version requirement ([#172](https://github.com/eslint-stylistic/eslint-stylistic/issues/172)) ([9bedf19](https://github.com/eslint-stylistic/eslint-stylistic/commit/9bedf190ffed78b3e380104ab7c25e4e9a8865e9))
* **ts/member-delimiter-style:** fix spaces ([#461](https://github.com/eslint-stylistic/eslint-stylistic/issues/461)) ([240006c](https://github.com/eslint-stylistic/eslint-stylistic/commit/240006cd887de265dc33eb027765846bd877bfd2))
* typo ([b24bfe9](https://github.com/eslint-stylistic/eslint-stylistic/commit/b24bfe9d6e7a9c5a6b72bf06d10c51c1701fa9c2))
* typo ([#286](https://github.com/eslint-stylistic/eslint-stylistic/issues/286)) ([417a108](https://github.com/eslint-stylistic/eslint-stylistic/commit/417a108691820fdbe79c26bf3d5dea6fde72ee74))
* unify `incorrect/correct` label for typescript documentation ([#174](https://github.com/eslint-stylistic/eslint-stylistic/issues/174)) ([d920ee1](https://github.com/eslint-stylistic/eslint-stylistic/commit/d920ee1cabaf3e5f3589e448af7d4a1fd250fa8b))
* update ([ea45274](https://github.com/eslint-stylistic/eslint-stylistic/commit/ea452746282f205e9ce8d9521135d620d8444e2e))
* update badge colors ([40ff37d](https://github.com/eslint-stylistic/eslint-stylistic/commit/40ff37d6003ad7bad7645fa40abbc87fb2dc1069))
* update deadlink ([#4](https://github.com/eslint-stylistic/eslint-stylistic/issues/4)) ([c7fede0](https://github.com/eslint-stylistic/eslint-stylistic/commit/c7fede0a74cc1839af9bcd2a258dd4e0317bda6e))
* update deadlink ([#8](https://github.com/eslint-stylistic/eslint-stylistic/issues/8)) ([5b7d999](https://github.com/eslint-stylistic/eslint-stylistic/commit/5b7d999fd59b674f58f79c5c3ef12ab50b8c01b3))
* update issue templates ([486e5b5](https://github.com/eslint-stylistic/eslint-stylistic/commit/486e5b511a7d5aba0bf5c494581b054e9256fd26))
* update links ([f80db20](https://github.com/eslint-stylistic/eslint-stylistic/commit/f80db20d67d2f796655fd83de370609e21fa701f))
* update migration guide ([d933fe8](https://github.com/eslint-stylistic/eslint-stylistic/commit/d933fe83ebecd717982f76cfad119a6373f3e420))
* update migration recommendation with ESLint deprecation announcement ([#196](https://github.com/eslint-stylistic/eslint-stylistic/issues/196)) ([4200a19](https://github.com/eslint-stylistic/eslint-stylistic/commit/4200a19f35902a8fbe2e1908eac364e103fd6f64))
* update packages page ([1e26023](https://github.com/eslint-stylistic/eslint-stylistic/commit/1e260236cc19dd310537377bb287fa6d06ad8541))
* update project progress ([6d87e61](https://github.com/eslint-stylistic/eslint-stylistic/commit/6d87e616c885ab2002cf70e4cb2cd4a8d592ccef))
* update project progress ([dbb0bf2](https://github.com/eslint-stylistic/eslint-stylistic/commit/dbb0bf2ac0eb3fba18f881149270fdff4368879e))
* update project progress ([#449](https://github.com/eslint-stylistic/eslint-stylistic/issues/449)) ([d6d72c8](https://github.com/eslint-stylistic/eslint-stylistic/commit/d6d72c8975f8a9be0e25dd6c41d03d90b00b2a62))
* update project stages ([1ca5539](https://github.com/eslint-stylistic/eslint-stylistic/commit/1ca5539d15363098dc678fd8db59b0487cd0a40b))
* update repo url ([618eb66](https://github.com/eslint-stylistic/eslint-stylistic/commit/618eb6614a6d08f694ec61ce62df0f4865285230))
* update repro link ([83e35d1](https://github.com/eslint-stylistic/eslint-stylistic/commit/83e35d13ba0a54ef484e20ac5df143b600d38fd3))
* update reproduction link ([48b915f](https://github.com/eslint-stylistic/eslint-stylistic/commit/48b915f4b502775f2d41aaf999772cfd44bfc324))
* update rules links for "plus" plugin ([#221](https://github.com/eslint-stylistic/eslint-stylistic/issues/221)) ([b4bd682](https://github.com/eslint-stylistic/eslint-stylistic/commit/b4bd6828106411f06d4fb5f443598483e37c23d0))
* update stages ([ac5780e](https://github.com/eslint-stylistic/eslint-stylistic/commit/ac5780ee2274da3ffad17612d625fa560d353b36))
* update styles ([#37](https://github.com/eslint-stylistic/eslint-stylistic/issues/37)) ([d725f19](https://github.com/eslint-stylistic/eslint-stylistic/commit/d725f19081c5649cb001b9a46aee0db7a116660b))
* update the issue template ([73bf17d](https://github.com/eslint-stylistic/eslint-stylistic/commit/73bf17d22b1d8379bf199300564ba3497513f669))
* update twoslash ([502d18a](https://github.com/eslint-stylistic/eslint-stylistic/commit/502d18af6f4a811835051fa112add16dcfaa1be6))


### Build Related

* introduce metadata ([d468154](https://github.com/eslint-stylistic/eslint-stylistic/commit/d468154456292321502a42d1bf92d2e566cfc362))
* try using a single package for release-please ([b3bf006](https://github.com/eslint-stylistic/eslint-stylistic/commit/b3bf006e340a5690479b82f457c4f9826ef24e67))


### Chores

* clean up types in jsdoc ([8629b43](https://github.com/eslint-stylistic/eslint-stylistic/commit/8629b4321d50a89386fc08be070bfef62bf4c3a2))
* improve code coverage ([bbb24c9](https://github.com/eslint-stylistic/eslint-stylistic/commit/bbb24c9c6976aceee76a8658a645ff1e142caca5))
* improve types ([90d31ba](https://github.com/eslint-stylistic/eslint-stylistic/commit/90d31ba7857d9839d7fd3b997332bfe96e4b3fd0))
* **indent:** add tests ([#428](https://github.com/eslint-stylistic/eslint-stylistic/issues/428)) ([1334417](https://github.com/eslint-stylistic/eslint-stylistic/commit/1334417307871bee72718c4d3056ac3e29d935e2))
* **js:** improve types consistentency ([c434dd8](https://github.com/eslint-stylistic/eslint-stylistic/commit/c434dd89347e8b17b51065b78d32b157867acbbd))
* **js:** migrate array-bracket-spacing to ts ([#109](https://github.com/eslint-stylistic/eslint-stylistic/issues/109)) ([652c59b](https://github.com/eslint-stylistic/eslint-stylistic/commit/652c59b8028811825e126f76064b69f68a4ffc6c))
* **js:** migrate array-element-newline to ts ([#123](https://github.com/eslint-stylistic/eslint-stylistic/issues/123)) ([6aa2cf4](https://github.com/eslint-stylistic/eslint-stylistic/commit/6aa2cf46eecbc1eda67df076bb84f426e7fb21d1))
* **js:** migrate arrow-parens to ts ([#110](https://github.com/eslint-stylistic/eslint-stylistic/issues/110)) ([fb7d889](https://github.com/eslint-stylistic/eslint-stylistic/commit/fb7d88984330f2bfd2cdfc549eca0438bffbe36b))
* **js:** migrate arrow-spacing to ts ([#111](https://github.com/eslint-stylistic/eslint-stylistic/issues/111)) ([8f5e1d5](https://github.com/eslint-stylistic/eslint-stylistic/commit/8f5e1d59bc9073a9c0a4a60f4cf12baf49e7865c))
* **js:** migrate brace-style ([#120](https://github.com/eslint-stylistic/eslint-stylistic/issues/120)) ([eec5367](https://github.com/eslint-stylistic/eslint-stylistic/commit/eec53676e4a5a77a2ed87b789585317777b83f5d))
* **js:** migrate comma-dangle to ts ([#140](https://github.com/eslint-stylistic/eslint-stylistic/issues/140)) ([fc0177f](https://github.com/eslint-stylistic/eslint-stylistic/commit/fc0177f353ba6e66a359302a2557af2691513649))
* **js:** migrate comma-spacing to ts ([#108](https://github.com/eslint-stylistic/eslint-stylistic/issues/108)) ([b981f7d](https://github.com/eslint-stylistic/eslint-stylistic/commit/b981f7dabc5f209abae58e922b33172f4ac6c4f2))
* **js:** migrate comma-style to ts ([#129](https://github.com/eslint-stylistic/eslint-stylistic/issues/129)) ([04f7dcd](https://github.com/eslint-stylistic/eslint-stylistic/commit/04f7dcd187a82433695e3ff1fc9bb6470fa84f6a))
* **js:** migrate computed-property-spacing to ts ([#132](https://github.com/eslint-stylistic/eslint-stylistic/issues/132)) ([f72988b](https://github.com/eslint-stylistic/eslint-stylistic/commit/f72988be1cc72c0e32560f93f93dc09230d805db))
* **js:** migrate eol-last to ts ([#78](https://github.com/eslint-stylistic/eslint-stylistic/issues/78)) ([8272076](https://github.com/eslint-stylistic/eslint-stylistic/commit/827207667c4c65f3c9065ec7dff6d1a26bdfad41))
* **js:** migrate function-call-argument-newline to ts ([#81](https://github.com/eslint-stylistic/eslint-stylistic/issues/81)) ([b363f6a](https://github.com/eslint-stylistic/eslint-stylistic/commit/b363f6a0ba2413b3d16dcb431d562e2b50622af1))
* **js:** migrate function-call-spacing to ts ([#83](https://github.com/eslint-stylistic/eslint-stylistic/issues/83)) ([1d2dd13](https://github.com/eslint-stylistic/eslint-stylistic/commit/1d2dd13ac982b1496c75ee3a04270ef514af6030))
* **js:** migrate function-paren-newline to ts ([#84](https://github.com/eslint-stylistic/eslint-stylistic/issues/84)) ([9824dc0](https://github.com/eslint-stylistic/eslint-stylistic/commit/9824dc06ed31f742a87dc1b4a23fcb70748933cd))
* **js:** migrate generator-star-spacing to ts ([#85](https://github.com/eslint-stylistic/eslint-stylistic/issues/85)) ([91c0354](https://github.com/eslint-stylistic/eslint-stylistic/commit/91c03545343e51b07d153dbed7f4e8c827185289))
* **js:** migrate implicit-arrow-linebreak to ts ([#86](https://github.com/eslint-stylistic/eslint-stylistic/issues/86)) ([e41dc55](https://github.com/eslint-stylistic/eslint-stylistic/commit/e41dc552c5b4939df6abdcb07a47560d9be8c680))
* **js:** migrate indent to ts ([#127](https://github.com/eslint-stylistic/eslint-stylistic/issues/127)) ([bdf97d5](https://github.com/eslint-stylistic/eslint-stylistic/commit/bdf97d5c6344ae7a1c043f1e4aed728636793cd1))
* **js:** migrate jsx-quotes to ts ([#77](https://github.com/eslint-stylistic/eslint-stylistic/issues/77)) ([06048c3](https://github.com/eslint-stylistic/eslint-stylistic/commit/06048c3de11485f3c78eeeb439ea74340c575ddd))
* **js:** migrate key-spacing to ts ([#87](https://github.com/eslint-stylistic/eslint-stylistic/issues/87)) ([1d34ebc](https://github.com/eslint-stylistic/eslint-stylistic/commit/1d34ebc02c37306ada3912cc9cb5c2384bb80acb))
* **js:** migrate keyword-spacing to ts ([#88](https://github.com/eslint-stylistic/eslint-stylistic/issues/88)) ([75100a2](https://github.com/eslint-stylistic/eslint-stylistic/commit/75100a28e46f3b4bf859ba9a29bf41dda4f25360))
* **js:** migrate linebreak-style to ts ([#89](https://github.com/eslint-stylistic/eslint-stylistic/issues/89)) ([4b24113](https://github.com/eslint-stylistic/eslint-stylistic/commit/4b24113e96882de8d9366b7b5117e282f201c8cc))
* **js:** migrate lines-around-comment to ts ([#114](https://github.com/eslint-stylistic/eslint-stylistic/issues/114)) ([e4330c3](https://github.com/eslint-stylistic/eslint-stylistic/commit/e4330c3528a24c26159b515db26c6416ff65a6ca))
* **js:** migrate lines-between-class-members to ts ([#116](https://github.com/eslint-stylistic/eslint-stylistic/issues/116)) ([2651e57](https://github.com/eslint-stylistic/eslint-stylistic/commit/2651e576f9b5d13a4309a00f4680d584211d3c3e))
* **js:** migrate max-len to ts ([#133](https://github.com/eslint-stylistic/eslint-stylistic/issues/133)) ([7b606eb](https://github.com/eslint-stylistic/eslint-stylistic/commit/7b606ebf08b233f82d8f107ec78385748381ed03))
* **js:** migrate max-statements-per-line to ts ([#90](https://github.com/eslint-stylistic/eslint-stylistic/issues/90)) ([38e619b](https://github.com/eslint-stylistic/eslint-stylistic/commit/38e619b27512fe2184e78024b7249f47356ad18b))
* **js:** migrate multiline-ternary to ts ([#91](https://github.com/eslint-stylistic/eslint-stylistic/issues/91)) ([1e62a46](https://github.com/eslint-stylistic/eslint-stylistic/commit/1e62a46b457dbd12f6cd07ac1ce0f8986d84411d))
* **js:** migrate new-parens to ts ([#82](https://github.com/eslint-stylistic/eslint-stylistic/issues/82)) ([6f8e9a2](https://github.com/eslint-stylistic/eslint-stylistic/commit/6f8e9a25e012ab08501bc5f62077a12f78d80444))
* **js:** migrate newline-per-chained-call to ts ([#92](https://github.com/eslint-stylistic/eslint-stylistic/issues/92)) ([8a31907](https://github.com/eslint-stylistic/eslint-stylistic/commit/8a31907fcba0c6a969533939f0a8f8461a161ddf))
* **js:** migrate no-confusing-arrow to ts ([#93](https://github.com/eslint-stylistic/eslint-stylistic/issues/93)) ([937ea20](https://github.com/eslint-stylistic/eslint-stylistic/commit/937ea20ab7254bc97a5d0b393e636f437571772a))
* **js:** migrate no-extra-parens to ts ([#106](https://github.com/eslint-stylistic/eslint-stylistic/issues/106)) ([19317ca](https://github.com/eslint-stylistic/eslint-stylistic/commit/19317ca0b26325cdc25c2fb34e9408fa61e8b25e))
* **js:** migrate no-extra-semi to ts ([#125](https://github.com/eslint-stylistic/eslint-stylistic/issues/125)) ([982797c](https://github.com/eslint-stylistic/eslint-stylistic/commit/982797c7830b2c6da9d77218443f5332212254a8))
* **js:** migrate no-floating-decimal to ts ([#94](https://github.com/eslint-stylistic/eslint-stylistic/issues/94)) ([d01b75f](https://github.com/eslint-stylistic/eslint-stylistic/commit/d01b75f0beb5d8352243649bfd65e1cc6f058f05))
* **js:** migrate no-mixed-operators to ts ([#135](https://github.com/eslint-stylistic/eslint-stylistic/issues/135)) ([a6dcd28](https://github.com/eslint-stylistic/eslint-stylistic/commit/a6dcd28deb1c1bcf737654fb17ba954601eadf81))
* **js:** migrate no-mixed-spaces-and-tabs to ts ([#95](https://github.com/eslint-stylistic/eslint-stylistic/issues/95)) ([daaa3f9](https://github.com/eslint-stylistic/eslint-stylistic/commit/daaa3f9fcf8f0e6ea20ecbc4b23b9c02f7f3c218))
* **js:** migrate no-multi-spaces to ts ([#80](https://github.com/eslint-stylistic/eslint-stylistic/issues/80)) ([61cf5bd](https://github.com/eslint-stylistic/eslint-stylistic/commit/61cf5bdaf22b6bfb9724387b747933bcc5e812d1))
* **js:** migrate no-multiple-empty-lines to ts ([#96](https://github.com/eslint-stylistic/eslint-stylistic/issues/96)) ([46be173](https://github.com/eslint-stylistic/eslint-stylistic/commit/46be1739575f1cdb5d144f37fe3bf1d45941dc07))
* **js:** migrate no-tabs to ts ([#79](https://github.com/eslint-stylistic/eslint-stylistic/issues/79)) ([dc7b430](https://github.com/eslint-stylistic/eslint-stylistic/commit/dc7b430890f2ddbddb7aaf1ae74eef45bbed113b))
* **js:** migrate no-trailing-spaces to ts ([#97](https://github.com/eslint-stylistic/eslint-stylistic/issues/97)) ([ecb77ad](https://github.com/eslint-stylistic/eslint-stylistic/commit/ecb77ad80f60f5f30fe6687e586c7b17e77ac141))
* **js:** migrate nonblock-statement-body-position to ts ([#98](https://github.com/eslint-stylistic/eslint-stylistic/issues/98)) ([3b5a8ff](https://github.com/eslint-stylistic/eslint-stylistic/commit/3b5a8fffb46dbc8e2d35c6b106096a9d4533e759))
* **js:** migrate object-curly-newline to ts ([#99](https://github.com/eslint-stylistic/eslint-stylistic/issues/99)) ([8a2f41f](https://github.com/eslint-stylistic/eslint-stylistic/commit/8a2f41fa6d7fbd8c56a78a134bea30ccb91547d3))
* **js:** migrate object-curly-spacing to ts ([#113](https://github.com/eslint-stylistic/eslint-stylistic/issues/113)) ([aff0a46](https://github.com/eslint-stylistic/eslint-stylistic/commit/aff0a46a72008851d9c748fa3841c5758952b4f5))
* **js:** migrate object-property-newline to ts ([#100](https://github.com/eslint-stylistic/eslint-stylistic/issues/100)) ([ce50536](https://github.com/eslint-stylistic/eslint-stylistic/commit/ce505362d39918441aff8452dc384dc456bead11))
* **js:** migrate one-var-declaration-per-line to ts ([#101](https://github.com/eslint-stylistic/eslint-stylistic/issues/101)) ([415d47e](https://github.com/eslint-stylistic/eslint-stylistic/commit/415d47e1987b4de2c4d3859e673e8e8321185c55))
* **js:** migrate operator-linebreak to ts ([#102](https://github.com/eslint-stylistic/eslint-stylistic/issues/102)) ([0885704](https://github.com/eslint-stylistic/eslint-stylistic/commit/08857040738aed8532ac206bc64d7912f0c09598))
* **js:** migrate padded-blocks to ts ([#121](https://github.com/eslint-stylistic/eslint-stylistic/issues/121)) ([aef33a1](https://github.com/eslint-stylistic/eslint-stylistic/commit/aef33a108e72762c81835dd3518743b137c6b488))
* **js:** migrate padding-line-between-statements to ts ([#138](https://github.com/eslint-stylistic/eslint-stylistic/issues/138)) ([c331177](https://github.com/eslint-stylistic/eslint-stylistic/commit/c33117798d88954cc5874255bc3406718f8d3a84))
* **js:** migrate quote-props to ts ([#137](https://github.com/eslint-stylistic/eslint-stylistic/issues/137)) ([e3023a1](https://github.com/eslint-stylistic/eslint-stylistic/commit/e3023a116ec6453e0b1d0bcf98084d5452774fb4))
* **js:** migrate rest-spread-spacing to ts ([#103](https://github.com/eslint-stylistic/eslint-stylistic/issues/103)) ([b6f3467](https://github.com/eslint-stylistic/eslint-stylistic/commit/b6f3467c85649e4fc5962787503872155f022318))
* **js:** migrate semi rule to ts ([#112](https://github.com/eslint-stylistic/eslint-stylistic/issues/112)) ([4a220ec](https://github.com/eslint-stylistic/eslint-stylistic/commit/4a220ec884bdf3df29673474c9cc39dce58eb04c))
* **js:** migrate semi-spacing to ts ([#124](https://github.com/eslint-stylistic/eslint-stylistic/issues/124)) ([f64318a](https://github.com/eslint-stylistic/eslint-stylistic/commit/f64318a96401e608ccdc7f46a81dfdbd11b35d10))
* **js:** migrate semi-style to ts ([#104](https://github.com/eslint-stylistic/eslint-stylistic/issues/104)) ([aa62c54](https://github.com/eslint-stylistic/eslint-stylistic/commit/aa62c54018c8dcfac7d76aaa8a9389525a65e8bb))
* **js:** migrate space-before-blocks to ts ([#105](https://github.com/eslint-stylistic/eslint-stylistic/issues/105)) ([f752a0b](https://github.com/eslint-stylistic/eslint-stylistic/commit/f752a0bbc9089645013dd7cab7653cc6ef2ce121))
* **js:** migrate space-in-parens to ts ([#117](https://github.com/eslint-stylistic/eslint-stylistic/issues/117)) ([559b3a5](https://github.com/eslint-stylistic/eslint-stylistic/commit/559b3a591f7bcb8e8bbf76be5a2477a317db1852))
* **js:** migrate space-infix-ops to ts ([#115](https://github.com/eslint-stylistic/eslint-stylistic/issues/115)) ([ab8879c](https://github.com/eslint-stylistic/eslint-stylistic/commit/ab8879c992d163cc3331f2dbbf83abc9b0a82f34))
* **js:** migrate space-unary-ops to ts ([#118](https://github.com/eslint-stylistic/eslint-stylistic/issues/118)) ([20279ed](https://github.com/eslint-stylistic/eslint-stylistic/commit/20279ed94a68ff00fb274b090f137bbb0f3e0f50))
* **js:** migrate switch-colon-spacing to ts ([#107](https://github.com/eslint-stylistic/eslint-stylistic/issues/107)) ([15b28e4](https://github.com/eslint-stylistic/eslint-stylistic/commit/15b28e4a961747b4fdf6f1ba38d93719bb14fa6c))
* **js:** migrate ts-space-before-function-paren to ts ([#119](https://github.com/eslint-stylistic/eslint-stylistic/issues/119)) ([bcd780d](https://github.com/eslint-stylistic/eslint-stylistic/commit/bcd780dafb852e98599affc9e5b537feb24a822c))
* **js:** unify parser resolver usage ([8fda8d4](https://github.com/eslint-stylistic/eslint-stylistic/commit/8fda8d4fefc33a22da0c41fb101cd3445957707b))
* **jsx:** cleanup utils ([c1c55a5](https://github.com/eslint-stylistic/eslint-stylistic/commit/c1c55a555c4ad405cdfa771dde0c4e2f03842390))
* **jsx:** migrate jsx-closing-bracket-location to ts ([#141](https://github.com/eslint-stylistic/eslint-stylistic/issues/141)) ([84e20bc](https://github.com/eslint-stylistic/eslint-stylistic/commit/84e20bcaffa0464494381c83c5bf6c4eebafcaa0))
* **jsx:** migrate jsx-closing-tag-location-to-ts ([#139](https://github.com/eslint-stylistic/eslint-stylistic/issues/139)) ([ad382ff](https://github.com/eslint-stylistic/eslint-stylistic/commit/ad382ffa3f753e3e72d051c30ad625cd93d2aee6))
* **jsx:** migrate jsx-curly-brace-presence to ts ([#150](https://github.com/eslint-stylistic/eslint-stylistic/issues/150)) ([f5db746](https://github.com/eslint-stylistic/eslint-stylistic/commit/f5db746678a819f05c9c8609c1759cc382350d00))
* **jsx:** migrate jsx-curly-newline to ts ([#148](https://github.com/eslint-stylistic/eslint-stylistic/issues/148)) ([8642a86](https://github.com/eslint-stylistic/eslint-stylistic/commit/8642a868df17b24e92ece04123cda9dc4d11692e))
* **jsx:** migrate jsx-curly-spacing to ts ([#152](https://github.com/eslint-stylistic/eslint-stylistic/issues/152)) ([2791248](https://github.com/eslint-stylistic/eslint-stylistic/commit/2791248e1f99df174addb1a3c560abf73a35763b))
* **jsx:** migrate jsx-max-props-per-line to ts ([#145](https://github.com/eslint-stylistic/eslint-stylistic/issues/145)) ([d304f71](https://github.com/eslint-stylistic/eslint-stylistic/commit/d304f7129668da070e6c2a32aee463d5df76367c))
* **jsx:** migrate jsx-newline to ts ([#143](https://github.com/eslint-stylistic/eslint-stylistic/issues/143)) ([3e5cf5e](https://github.com/eslint-stylistic/eslint-stylistic/commit/3e5cf5e6d3b32c36511f8626edca136dfb139d9b))
* **jsx:** migrate jsx-props-no-multi-spaces to ts ([#151](https://github.com/eslint-stylistic/eslint-stylistic/issues/151)) ([6f439c0](https://github.com/eslint-stylistic/eslint-stylistic/commit/6f439c0ec70af70a543708a5224f79ca9bb0755b))
* **jsx:** migrate jsx-self-closing-comp to ts ([#142](https://github.com/eslint-stylistic/eslint-stylistic/issues/142)) ([065719b](https://github.com/eslint-stylistic/eslint-stylistic/commit/065719b775adc1896896409fd6edff7b76c8d279))
* **jsx:** migrate jsx-sort-props to ts ([#147](https://github.com/eslint-stylistic/eslint-stylistic/issues/147)) ([11d433e](https://github.com/eslint-stylistic/eslint-stylistic/commit/11d433edcfd72f6dfb2c21550ff9c805ce0785d4))
* **jsx:** migrate renaming rules to ts ([#154](https://github.com/eslint-stylistic/eslint-stylistic/issues/154)) ([91e2f75](https://github.com/eslint-stylistic/eslint-stylistic/commit/91e2f750fededb9b7b9d7bafebc7289d51b24d37))
* **jsx:** refactor test-utils/parser ([2b801a1](https://github.com/eslint-stylistic/eslint-stylistic/commit/2b801a13e8d43d6110d982cb418699a5d983662e))
* migrate `node.typeParameters` ([9bb007b](https://github.com/eslint-stylistic/eslint-stylistic/commit/9bb007bf9cbaecb4c76eebc054f5eae805307149))
* migrate all jsx utils ([0a568b2](https://github.com/eslint-stylistic/eslint-stylistic/commit/0a568b27de68c5879d65e7352a8c65cb105bc294))
* migrate block-spacing to ts ([#76](https://github.com/eslint-stylistic/eslint-stylistic/issues/76)) ([602bfdc](https://github.com/eslint-stylistic/eslint-stylistic/commit/602bfdcdcabd59805fd67362b4c37f979796c23a))
* migrate more jsx utils to ts ([f878988](https://github.com/eslint-stylistic/eslint-stylistic/commit/f8789888ff6fe818c8fedec7f805504ac00314da))
* migrate more rules to ts ([f241002](https://github.com/eslint-stylistic/eslint-stylistic/commit/f2410021d5a3b0c65dceec4174eeaf5abd0b83f5))
* migrate no-whitespace-before-property to ts ([#131](https://github.com/eslint-stylistic/eslint-stylistic/issues/131)) ([3f4b748](https://github.com/eslint-stylistic/eslint-stylistic/commit/3f4b74882508f570e515078f42c5fd681d2ea15b))
* migrate quotes to ts ([#134](https://github.com/eslint-stylistic/eslint-stylistic/issues/134)) ([004ec99](https://github.com/eslint-stylistic/eslint-stylistic/commit/004ec9956c21e6123b831b8a2739c621e06e5474))
* migrate some jsx rules to ts ([b71f887](https://github.com/eslint-stylistic/eslint-stylistic/commit/b71f887cc506871c3de856645ee813055e10cf46))
* migrate to esm ([#58](https://github.com/eslint-stylistic/eslint-stylistic/issues/58)) ([1ba6610](https://github.com/eslint-stylistic/eslint-stylistic/commit/1ba6610db7d9e86d514f1709257cba8834616f93))
* migrated dot-location to ts ([#72](https://github.com/eslint-stylistic/eslint-stylistic/issues/72)) ([9b2d18f](https://github.com/eslint-stylistic/eslint-stylistic/commit/9b2d18f5ea104bc1d48199affc661e3069e7361a))
* move fixtures ([410e55f](https://github.com/eslint-stylistic/eslint-stylistic/commit/410e55f929cc3b9f41d4e5d5ea5264ee7d10d8ca))
* rename folders for consistency ([472eb9f](https://github.com/eslint-stylistic/eslint-stylistic/commit/472eb9f22431506e740a055bed89e89c94e9bf90))
* rename packages scope ([cfdde46](https://github.com/eslint-stylistic/eslint-stylistic/commit/cfdde46b1db8d6e238d733ead8be14a3ba8f1882))
* **ts:** improve type strictness, [#64](https://github.com/eslint-stylistic/eslint-stylistic/issues/64) ([9731ec9](https://github.com/eslint-stylistic/eslint-stylistic/commit/9731ec9a2a14b9865b37e8c254c9294668926b4a))
* **ts:** migrate spaced-comment to ts ([#122](https://github.com/eslint-stylistic/eslint-stylistic/issues/122)) ([5b6fd65](https://github.com/eslint-stylistic/eslint-stylistic/commit/5b6fd65ac457b226ca79c84c0d50cd747146ef76))
* use `context.sourceCode` ([49a290e](https://github.com/eslint-stylistic/eslint-stylistic/commit/49a290e0fd9174b86159d9381fe318811dd304da))


### Performance

* no longer rely on `jsx-ast-utils`, reduce install size ([#49](https://github.com/eslint-stylistic/eslint-stylistic/issues/49)) ([7c698b6](https://github.com/eslint-stylistic/eslint-stylistic/commit/7c698b6175a2b85bd0454841cf6a9bdc8f6ca52c))

## [2.6.0-beta.1](https://github.com/eslint-stylistic/eslint-stylistic/compare/v2.6.0-beta.0...v2.6.0-beta.1) (2024-07-27)


### Features

* migrate to `@types/eslint` `v9.6.0` ([#479](https://github.com/eslint-stylistic/eslint-stylistic/issues/479)) ([ea72aae](https://github.com/eslint-stylistic/eslint-stylistic/commit/ea72aaedc94c8178aa338f563b717f33ffc713f7))
* **ts/padding-line-between-statements:** support for enum ([#453](https://github.com/eslint-stylistic/eslint-stylistic/issues/453)) ([7126f21](https://github.com/eslint-stylistic/eslint-stylistic/commit/7126f21429bab2afb7f5fd1dd97a3c9fbfd897e2))


### Bug Fixes

* **indent:** handle mixed spaces and tabs ([#465](https://github.com/eslint-stylistic/eslint-stylistic/issues/465)) ([d5ae88d](https://github.com/eslint-stylistic/eslint-stylistic/commit/d5ae88d6602f0e506872d06ef3dd1b4e6443638e))
* **type-generic-spacing:** consider parentheses ([#467](https://github.com/eslint-stylistic/eslint-stylistic/issues/467)) ([fd08dd8](https://github.com/eslint-stylistic/eslint-stylistic/commit/fd08dd862081d34094423441115f39d7013b6464))


### Documentation

* fix note block display ([#471](https://github.com/eslint-stylistic/eslint-stylistic/issues/471)) ([28db32c](https://github.com/eslint-stylistic/eslint-stylistic/commit/28db32cb894cb1f7a70eaa0ef5f162aaaf1cf08c))
* **ts/member-delimiter-style:** fix spaces ([#461](https://github.com/eslint-stylistic/eslint-stylistic/issues/461)) ([240006c](https://github.com/eslint-stylistic/eslint-stylistic/commit/240006cd887de265dc33eb027765846bd877bfd2))


### Chores

* release-please-mark ([690707f](https://github.com/eslint-stylistic/eslint-stylistic/commit/690707f8ed92d6e8427923ca0410b209484d81fc))
