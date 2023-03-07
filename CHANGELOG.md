## [0.3.8](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/compare/v0.3.6...v0.3.8) (2023-03-07)


### 🐛 Bug Fixes | Bug 修复

* **cli:** 修复子命令 update 加模板参数不生效问题 ([8120853a](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/8120853a86345b19952ea66f79853ecc7519f4dc))


### 📝 Documentation | 文档

* **cli:** 完善 vue-demo ([33e219fb](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/33e219fbc98e00cde62fa52a6d436b48da780992))



## [0.3.4](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/compare/v0.3.1...v0.3.4) (2023-03-03)


### 🐛 Bug Fixes | Bug 修复

* **core:** transform syntax in vue template attribution error ([c3ef07f6](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/c3ef07f685c662f7024be63532163ad553f5e481))



## [0.3.1](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/compare/v0.2.7...v0.3.1) (2023-03-03)


### ✨ Features | 新功能

* **cli:** add ts-check in config when inited by cli ([6edd8ce0](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/6edd8ce07beeecb60b9ccaec76fca3b7345e9593))
* **core:** add cwd options in initText and glob.ts ([be153a8c](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/be153a8ca239f77d7187b3da086f576f71669f06))
* **vsce:** finish frist command comparing tranformed text with source ([051de295](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/051de295d5c299d5bf28e750d04160b5ccd86a97))


### 🐛 Bug Fixes | Bug 修复

* **core:** replace fs.cpSync [#6](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/issues/6) ([eaf3aa4e](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/eaf3aa4ebffc89bd3796374f23deecc89a881718))
* **vsce:** change package manager with yarn to fix package error ([742d2dcc](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/742d2dccabe40ee9b16861787b110a89b81c0c8c))


### 🔧 Continuous Integration | CI 配置

* add npm publish ([9b9faec5](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/9b9faec598565c7e7802386a6cb88bd8e2ec8a35))
* add npm publish ([49974961](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/4997496129dff307f9dcc84e776175b8fa06e469))



## [0.2.7](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/compare/v0.0.7...v0.2.7) (2023-02-28)


### ♻ Code Refactoring | 代码重构

* form yo-auto-i18n ([abc0a500](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/abc0a50024dc6144a99bd7b7bb79760ab292c08d))
* refactor all ([13eaa940](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/13eaa9407dc6a415b1996b0c891966cd90fbc5ab))


### ✅ Tests | 测试

* 添加测试用例 ([69b363d0](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/69b363d02cca2211cbb7ed95503d95e69ec7f45f))
* 完善测试用例 ([a62e93d1](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/a62e93d10de86ee93e9a6e67f568cfca4dd1e850))
* add test examples ([9a99e5bc](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/9a99e5bc2f23b21d0aa873caa8126ac5ce88439d))


### ✨ Features | 新功能

* 完善 transform Collector ([6a630f06](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/6a630f06bbec5750d57a9c6b3d09457e6d674505))
* 完善子命令trans的逻辑 ([935b1488](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/935b14884d23fe19cc02b477a6313251b41bfd14))
* 完善vue解析中属性值的一些特殊逻辑 ([c044be61](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/c044be61b2a451048d6d911aca547eba1a0fc352))
* 新增功能revert ([87713500](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/87713500838253fd6a377b41180a68380972360c))
* add conventional-changelog ([01c02b9d](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/01c02b9d94b80719a89b5baf8828403dd9c1ad90))
* add cosmiconfig ([dcb7c71b](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/dcb7c71b0f65d36ad91eb1f7a9a6c13cf4f487b1))
* add test scripts ([28f8299a](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/28f8299abdafc422c09771e24ee7157af3e41ca7))
* add transInterpolationsMode config ([83c591a7](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/83c591a75c5c6938e4752ad4e816030949319134))
* add vitest ([3e139baa](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/3e139baab6b71fd849265838fe96e45af5b5e67c))
* add vue demo ([0dbd4c31](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/0dbd4c31177928483219637bae93a2a27946b551))
* refactor test ([c4c117fe](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/c4c117fed1050a4e60635c7785f17a8b91d16096))


### 🐛 Bug Fixes | Bug 修复

* **core:** replace fs.cpSync [#6](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/issues/6) ([e55ecc83](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/e55ecc83f496ca73d31e4ef24431ae3a88b98169))
* ignore deme eslint check ([d37cb12a](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/d37cb12a47ecab0862281d1dc391f348ff904056))
* replace replaceAll ([c6d081e9](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/c6d081e9a43ad3238cbdd2075e67cc950b345018))
* replace replaceAll ([7ac3e341](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/7ac3e3412363a67e21e34534273ea07afd51d834))
* revert format error path ([929514f5](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/929514f5c910667b8d087e75d69dc313eaefa71f))
* update not clear deleted key ([fc3bfc19](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/fc3bfc19408e0995b7bffb156b7507583458b8fa))


### 🔧 Continuous Integration | CI 配置

* add npm publish ([ef1dfc1b](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/ef1dfc1b5b30b199f130a6916ae8b05280ad627f))



## [0.0.7](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/compare/v0.0.6...v0.0.7) (2022-12-19)


### ✨ Features | 新功能

* add updateLocales command ([ca317f4d](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/ca317f4db156b3d9aa9b52a507491daa930e0daf))
* finish generateXlsx and updateLocalesFromXlsx ([9f0d8dbc](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/9f0d8dbc7df2cb7ec92e9ad504c4ac66850d5e0f))



## [0.0.4](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/compare/8627a69a6f538932fc21f1ff63fcec3014377830...v0.0.4) (2022-12-17)


### ✨ Features | 新功能

* add updateLocales command and types ([9ff66136](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/9ff661361f06833c0f0fea79192adf80b23e62ef))
* init ([c7684af6](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/c7684af6219ad2330688bf52bb1e5385d72197e9))




---

## 参考

* [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

* [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) - 一种用于给提交信息增加人机可读含义的规范

* [Angular Contributing Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
