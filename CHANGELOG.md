# [4.0.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v3.1.1...v4.0.0) (2024-05-10)


### Bug Fixes

* **node:** drop support for node 14 ([7e06217](https://github.com/andyrooger/vs-compat-ts-plugin/commit/7e0621730b1528188904219ea0bae2695f2d6a9b))


### BREAKING CHANGES

* **node:** Node 14.x is no longer supported

Use a supported version of node. Node 18.x or higher is supported currently.
Node 16.x and above is allowed too until it fails CI, but is unsupported.

## [3.1.1](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v3.1.0...v3.1.1) (2023-04-28)


### Bug Fixes

* upgrade @commitlint/config-conventional from 17.0.3 to 17.4.4 ([7d4ae3a](https://github.com/andyrooger/vs-compat-ts-plugin/commit/7d4ae3abda9d8a33defed1a5b448b97dfe961dc1))
* upgrade husky from 8.0.1 to 8.0.3 ([6085a6b](https://github.com/andyrooger/vs-compat-ts-plugin/commit/6085a6be49d1749942bd9c7a0e729dd79604b117))

# [3.1.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v3.0.0...v3.1.0) (2023-04-27)


### Features

* **node:** bump node support to 20 ([c861c7e](https://github.com/andyrooger/vs-compat-ts-plugin/commit/c861c7e21d664f473d51edc76140a8bed1c39307))

# [3.0.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v2.3.0...v3.0.0) (2022-06-28)


### Features

* **node:** bump node support ([b2dddd9](https://github.com/andyrooger/vs-compat-ts-plugin/commit/b2dddd9c18e444346d0f7d3ed84d5dcd056b1c69)), closes [#42](https://github.com/andyrooger/vs-compat-ts-plugin/issues/42)


### BREAKING CHANGES

* **node:** Node 10 and 12 are no longer supported. 14.17+ only

# [2.3.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v2.2.0...v2.3.0) (2021-05-17)


### Features

* **orderwarning:** ignore plugins included by their local paths ([80e5be2](https://github.com/andyrooger/vs-compat-ts-plugin/commit/80e5be2246115cbb3bf435cb88439daa2c0cda03))

# [2.2.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v2.1.0...v2.2.0) (2020-04-16)


### Features

* **package:** TS as a peer dependency ([86ea026](https://github.com/andyrooger/vs-compat-ts-plugin/commit/86ea026c6edbc594d9f33516e7d7173ace135227)), closes [#14](https://github.com/andyrooger/vs-compat-ts-plugin/issues/14)

# [2.1.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v2.0.0...v2.1.0) (2020-04-13)


### Features

* **warnings:** tsconfig warnings ([3a4e65d](https://github.com/andyrooger/vs-compat-ts-plugin/commit/3a4e65d79155caa774944b9ab5b5864922db80f3)), closes [#5](https://github.com/andyrooger/vs-compat-ts-plugin/issues/5)

# [2.0.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v1.1.2...v2.0.0) (2020-04-11)


### Features

* **defaults:** on by default ([32841f0](https://github.com/andyrooger/vs-compat-ts-plugin/commit/32841f0c1fe5c3dc9703253c63b17c9ccdd8eee6)), closes [#11](https://github.com/andyrooger/vs-compat-ts-plugin/issues/11)
* **defaults:** onByDefault option ([ca2795c](https://github.com/andyrooger/vs-compat-ts-plugin/commit/ca2795cc17a86a35aa7b6699c8499bc0fc182401)), closes [#11](https://github.com/andyrooger/vs-compat-ts-plugin/issues/11)


### BREAKING CHANGES

* **defaults:** All options are now turned on by default. If you want an option turned off you can
do this explicitly per option.

## [1.1.2](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v1.1.1...v1.1.2) (2020-04-11)


### Bug Fixes

* **release:** npm auth again ([33bbef5](https://github.com/andyrooger/vs-compat-ts-plugin/commit/33bbef5f668b842a1a4b25f3e4e981d91ddb577f))

## [1.1.1](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v1.1.0...v1.1.1) (2020-04-11)


### Bug Fixes

* **release:** npm authentication ([7ce4b45](https://github.com/andyrooger/vs-compat-ts-plugin/commit/7ce4b45dbfd3df6a6a3405e29bd20be75763b723))

# [1.1.0](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v1.0.1...v1.1.0) (2020-04-11)


### Features

* **usevstypescript:** mock typescript ([0a64173](https://github.com/andyrooger/vs-compat-ts-plugin/commit/0a64173b8b9f805f9162305b2431ee5cab8cfda8)), closes [#4](https://github.com/andyrooger/vs-compat-ts-plugin/issues/4)

## [1.0.1](https://github.com/andyrooger/vs-compat-ts-plugin/compare/v1.0.0...v1.0.1) (2020-04-10)


### Performance Improvements

* **release:** smaller package size ([e77fac0](https://github.com/andyrooger/vs-compat-ts-plugin/commit/e77fac0859d7da2bae35853d2788ed8bb00bbffa)), closes [#8](https://github.com/andyrooger/vs-compat-ts-plugin/issues/8)

# 1.0.0 (2020-04-10)


### Bug Fixes

* **release:** Correct YAML in release CI job ([e108df6](https://github.com/andyrooger/vs-compat-ts-plugin/commit/e108df6dacaca0b113f70878152b94fdc890fdef))

### Features

* **cwd:** Set working directory ([c33bf8f](https://github.com/andyrooger/vs-compat-ts-plugin/commit/c33bf8f6d7ab80d3608756542ec40d80975e611e))
