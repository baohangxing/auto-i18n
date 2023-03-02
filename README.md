<br />

<p align="center">
<img src="https://github.com/baohangxing/auto-i18n/raw/main/images/logo.svg" style="width:250px" />
</p>

<p align="center">
一个可以快速将中文项目中的中文替换成 i18n 国际化标记的工具库。
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@h1mple/auto-i18n-cli">
<img alt="NPM version" src="https://img.shields.io/npm/v/@h1mple/auto-i18n-cli?label=&color=c95f8b&amp;"></a>
</p>

## 介绍

Auto-i18n 项目采用 monorepo 结构，将代码库分为三个包，分别是 cli、core 和 vsce。

```txt
.
└──  packages
    ├── cli
    ├── core
    └── vsce
```

其中，cli 子包是基于 core 包开发的命令行工具。

core 是整个 Auto-i18n 项目的核心，它包含了中文文本自动检测、替换等核心功能，为 cli 和 vsce 提供了必要的支持。

vsce 是基于 core 开发的 VS Code 插件。

## cli

auto-i18n 的 cli 命令行工具提供了许多有用的功能，使得国际化过程更加方便快捷。

首先，cli 工具支持根据项目情况初始化 auto-i18n 配置，并且支持多种配置格式，包括 .json, .yaml, .yml, .js, .cjs, .config, .config.js, .config, .cjs 等以及在 package.json 中配置，方便开发者按照自己的习惯进行配置。

其次，cli 工具支持多种文件格式，包括 .mjs, .cjs, .js, .ts, .jsx, .tsx, .vue 等后缀格式的文件进行中文提取，并且支持 vue2.0，vue3.0，react 提取中文。同时，开发者可以通过 /\*auto-i18n-ignore\*/ 和 <\!--auto-i18n-ignore--> 注释来忽略中文提取，灵活方便。

此外，cli 工具支持将提取的中文以 key-value 形式存入 *.json 语言包进行预览，并且可以自定义 key，方便开发者进行国际化翻译。开发者也可以为各种格式自定义 i18n 的调用对象、方法名、方法定义以及添加第三方包的导入，灵活应对不同的需求。

另外，cli 工具支持各个语言包根据主语言包的更新，支持语言包导出 xlsx 文件，并且可以通过 xlsx 文件进行更新，方便开发者管理语言包。同时，它还支持检测项目中的语言包是否翻译完全，以及将 i18n 国际化标记的文件进行还原。

最后，cli 工具还支持 eslint 格式化代码以及配置是否格式化文件的规则，支持使用通配符配置各个命令的操作范围，以及自定义命令生成的文件的输出路径以及文件名，更加方便开发者进行国际化工作。

详细见 [README of cli](./packages/cli/README.md)

## core

Auto-i18n 的 core 是整个项目的核心包，它包含了文件的解析、替换等核心功能，为其他项目提供了必要的支持。

详细见 [README of core](./packages/core/README.md)

## vsce

Vscode Extension of auto-i18n

Auto-i18n 的 vsce 包是基于 core 包开发的 VS Code 插件，可以方便地在 VS Code 中使用 Auto-i18n 工具进行国际化。

VS Code 插件可以直接在 VS Code 编辑器中运行，通过可视化的界面和交互方式，使得国际化操作更加直观和方便。此外，VS Code 插件可以与其他插件和功能进行集成，如代码自动补全、语法高亮、错误检查等，使得国际化的过程更加顺畅。

因此，虽然 Auto-i18n 的 CLI 命令行工具已经可以满足大部分用户的需求，但是开发 VS Code 插件仍然是必要的，因为它可以为用户提供更加方便、交互性更强的国际化方式，降低用户使用的心智负担，同时，VS Code 插件也可以为 Auto-i18n 提供更广泛的用户群体和更好的推广效果。

详细见 [README of vsce](./packages/vsce/README.md)
