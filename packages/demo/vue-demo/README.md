<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [vue-demo](#vue-demo)
  - [Project setup](#project-setup)
    - [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)
    - [Compiles and minifies for production](#compiles-and-minifies-for-production)
    - [Lints and fixes files](#lints-and-fixes-files)
    - [Customize configuration](#customize-configuration)
  - [auto-i18n 使用示例](#auto-i18n-%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
    - [init](#init)
    - [trans](#trans)
    - [check](#check)
    - [genlsx](#genlsx)
    - [update](#update)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# vue-demo

## Project setup

```
pnpm run install
```

### Compiles and hot-reloads for development

```
pnpm run serve
```

### Compiles and minifies for production

```
pnpm run build
```

### Lints and fixes files

```
pnpm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## auto-i18n 使用示例

### init

详细可见[init 文档](https://github.com/baohangxing/yo-auto-i18n/tree/main/packages/cli#init)

删除 根目录下的 `auto.config.cjs` 文件

运行

```
pnpm run auto:init
```

### trans

详细可见[trans 文档](https://github.com/baohangxing/yo-auto-i18n/tree/main/packages/cli#trans)

运行

```
pnpm run auto:trans-modify
```

### check

详细可见[check 文档](https://github.com/baohangxing/yo-auto-i18n/tree/main/packages/cli#check)

运行

```
pnpm run auto:check
```

### genlsx

详细可见[genlsx 文档](https://github.com/baohangxing/yo-auto-i18n/tree/main/packages/cli#genlsx)

运行

```
pnpm run auto:genlsx
```

### update

详细可见[update 文档](https://github.com/baohangxing/yo-auto-i18n/tree/main/packages/cli#update)

删除或者添加 `src/lang/locales/cN.json` 中的一个语言字段

运行

```
pnpm run auto:update
```

或者编辑 `1.xlsx`下的多语言

运行

```
pnpm run auto:update2
```
