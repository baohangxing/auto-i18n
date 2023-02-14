> 请阅读[gitlab上的文档](https://gitcn.yostar.net:8888/hangxing.bao/yo-auto-i18n#%E4%BB%8B%E7%BB%8D)以获取更好的阅读体验

# 介绍

这是一个可以快速将中文项目替换成 i18n 国际化标记的命令工具, 除此之外, 它还具备智能初始化, json 语言包 xlsx 导出, json 语言包更新以及检测是否翻译完全等功能。

## 功能

- [x] 支持根据你的项目情况初始化 yo-auto-i18n 配置
- [x] 支持多种 yo-auto-i18n 配置格式，包括.json, .yaml, .yml, .js, .cjs, .config, .config.js, .config, .cjs 等以及在 package.json 中配置

- [x] 支持.mjs, .cjs, .js, .ts, .jsx, .tsx, .vue 后缀格式的文件进行中文提取
- [x] 支持 vue2.0，vue3.0，react 提取中文
- [x] 支持通过 /\*yo-auto-i18n-ignore\*/ 和 <\!--yo-auto-i18n-ignore--> 注释，忽略中文提取
- [x] 支持将提取的中文以 key-value 形式存入 \*.json 语言包进行预览并自定义 key
- [x] 支持为各种格式自定义 i18n 的调用对象, 方法名, 方法定义 以及 添加第三方包的导入

- [x] 支持各个语言包根据主语言包的更新
- [x] 支持语言包导出 xlsx 文件, 并通过 xlsx 文件进行更新
- [x] 支持检测项目中的语言包是否翻译完全
- [x] 支持将 i18n 国际化标记的文件进行还原

- [x] 支持 eslint 格式化代码以及配置是否格式化文件的规则
- [x] 支持使用通配符配置各个命令的操作范围
- [x] 支持自定义命令生成的文件的输出路径以及文件名

## 快速开始

- 第一步: 安装

```sh
npm i yo-auto-i18n -D
```

or

```sh
yarn add yo-auto-i18n -D
```

or

```sh
pnpm i yo-auto-i18n -D
```

- 第二步: 给你项目添加 I18n 库，创建 locales 文件夹以及多语言 json 文件

示例:

```
src
└── locales
    ├── ja-jp.json
    ├── ko-kr.json
    └── zh-cn.json
```

- 第三步: 初始化 yo-auto-i18n 配置

```sh
auto init
```

可以在 [init 命令说明](#init) 中看到对于初始化更加详细的说明。

- 第四步：开始转换

```sh
auto trans
```

该命令会将项目所有的文件的中文替换成 i18n 国际化标记并导出一个 key-value 形式 json 文件供你预览

你需要修改该 json 文件来自定义每条中文在语言包中的 key

在你修改了导出的 json 文件后使用命令

运行

```sh
auto trans --modify --template ./lang-key-value.json
```

好！不出意外，现在你的项目中的所有中文已经完成了转换，[命令详细说明](#trans) 有对 `trans` 命令使用的有更加详细的说明。

## 配置详细说明

yo-auto-i18n 的配置文件可以通过下列任意一种进行配置, 并且所有的配置项都是**可选的**。

- 在 `package.json` 的 `auto` 属性
- 一个 JSON 或者 YAML格式的 `.autorc` 文件
- 一个 `.autorc.json`, `.autorc.yaml`, `.autorc.yml`, `.autorc.js` 或者 `.autorc.cjs` 文件
- 一个在 `.config` 子目录下的 `autorc`, `autorc.json`, `autorc.yaml`, `autorc.yml`, `autorc.js` 或者 `autorc.cjs` 文件
- 一个以 CommonJS module 导出一个对象的 `auto.config.js` 或者 `auto.config.cjs` 文件

### 配置字段

| 字段            | 类型 | 默认值 | 说明 |
| --------------- | ---- | ---- | ------ |
| localesJsonDirs | string[] \| string | ['**/locales/**.json'] | 使用通配符定义项目语言包的位置, 语法请参考[通配符语法](#通配符语法)  |
| locales         | string[] | [] //默认为所有文件 | 需要翻译的语言包, 例如['ja', 'zh-cn'], 语言包的json文件需要在 `localesJsonDirs` 中 |
| baseLocale      | string |   ''   | 基础语言包的名称，即中文语言包 例如 `zh-cn` |
| untransSymbol  | (locale: string) => string | `[${locale.toUpperCase()}]` | 未翻译的前缀标志, 该前缀标志会出现在其他语言的json语言包中并拼接在中文语句前面, 表示这条语句还未翻译, 例如`[JA]你好` |
| includes       | string[] | ['\*\*/\*.{js,cjs,ts,mjs,jsx,tsx,vue}'] //默认为所有文件 | 使用通配符定义进行替换的范围, 语法请参考[通配符语法](#通配符语法)  |
| transLacaleWord  | (word: string, locale: string, toLocale: string) => Promise\<string\> |  | 使用 `update` 命令进行更新的时候，可以使用该配置进行机器翻译，出现未翻译的前缀标志的语句会调用该配置函数得到对应语言的 value 值 |
| outputFileDir | string | './' | 所有导出文件的导出路径，请使用你项目的相对路径进行配置 |
| transInterpolationsMode | 'NamedInterpolationMode' \| 'ListInterpolationMode' | 'NamedInterpolationMode' | i18n格式语法的插值模式，可参考 [TransInterpolationsMode](#transinterpolationsmode), 占位符中插值可以配置为具名插值模式或者列表插值模式两种模式 |
| i18nCallRules | Record<FileExtension, I18nCallRule> | [见I18nCallRule](#i18ncallrule) | 各个格式的文件配置i18n的应用和使用规则 [见I18nCallRule](#i18ncallrule) |
| checkUsageMatchAppend | RegExp[] | [] | check命令中, 定义额外的匹配代码中的i18n key的正则表达式, 它将作为额外的匹配机制而不会覆盖原有的匹配逻辑 |
| autoFormat | boolean | false | 命令修改或者创建的文件是否进行格式化，当设置 `true` 时，需要项目中已经添加配置 eslint |
| autoFormatRules | string[]| [] //默认为所有文件 | 使用通配符定义进行格式化的范围, 不想或者不能进行格式化的文件可以通过该项配置,语法请参考[通配符语法](#通配符语法) |
| outputXlsxNameBy | object | [见outputXlsxNameBy](#outputxlsxnameby)  | 定义导出文件的名称， [见outputXlsxNameBy](#outputxlsxnameby) |

### FileExtension

支持中文替换文件的后缀名

- 'js'
- 'ts'
- 'cjs'
- 'mjs'
- 'jsx'
- 'tsx'
- 'vue'

### TransInterpolationsMode

占位符中插值的两种模式 ` 'NamedInterpolationMode' ` |  `'ListInterpolationMode'`

- `NamedInterpolationMode` 具名插值模式

命名插值允许您指定 JavaScript 中定义的变量。在下面的例子中，您可以通过将 JavaScript 定义的 `msg` 作为转换功能的参数进行本地化。

```js
const messages = {
  en: {
    message: {
      hello: '{msg} world'
    }
  }
}
```

```vue
<p>
{{ $t('message.hello', { msg: 'hello' }) }}
</p>
```

- `ListInterpolationMode` 列表插值模式

列表插值允许您指定 JavaScript 中定义的数组。您可以通过将 JavaScript 定义的数组的 0 索引项作为转换函数的参数进行本地化。

```js
const messages = {
  en: {
    message: {
      hello: '{0} world'
    }
  }
}
```

```vue
<p>
{{ $t('message.hello', ['hello']) }}
</p>
```

可参考 [vue i18n Interpolations](https://vue-i18n.intlify.dev/guide/essentials/syntax.html#interpolations)

### I18nCallRule

考虑到 i18n 的库多种多样以及不同类型的文件的导入逻辑各不相同，在使用时可以为每种拓展名文件自定义 i18n 工具的调用对象, 方法名, 方法定义 以及 第三方包的导入，如下：

| 字段            | 类型 | 默认值 | 说明 |
| --------------- | ---- | ---- | ------ |
| transCaller | string | ''   | 获取语言的函数名的调用对象 |
| transIdentifier     | string | 't' | 通过 key 获取语言的函数名，多数 i18n 的库中该名为 `t` |
| variableDeclaration | string | 'const { t } = useI18n();' | 在 `transIdentifier` 是开发者重新定义的时候，用以添加这些语句，会插入到脚本 importDeclaration 之后 |
| importDeclaration   | string | 'import { useI18n } from "vue-i18n";' | 引用声明，在转换后会加到文件的头部位置 |

根据默认的配置 转换到项目中是这样的：

```ts
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const name = t('names.name') // 示例
```

通过这几个配置的灵活配置一般而言可以覆盖大多数的 i18n 的使用场景，在举个例子: 在vue2中将 t 绑定为全局的 `trans` 方法，你可配置成这样：

```json
{
  "transCaller": "this",
  "transIdentifier": "trans",
  "variableDeclaration": "",
  "importDeclaration": ""
}
```

此时转换到项目中是这样的：

```ts
const name = this.trans('names.name')
```

或者

```vue
<div>
{{this.trans('names.name')}}
</div>
```

### outputXlsxNameBy

自定义各个命令导出文件的名称, 为了防止后面导出的文件因为同名覆盖上一次导出的文件, 在导出文件名称的后面会加上**导出时的时间（日期加时分秒）**

| 字段            | 类型 | 默认值 | 说明 |
| --------------- | ---- | ---- | ------ |
| outputXlsxNameBy.genXlsx | string | 'genXlsx' | `genXlsx` 命令导出的相关文件的名称 |
| outputXlsxNameBy.trans | string | 'trans' | `trans` 命令导出的相关文件的名称 |
| outputXlsxNameBy.check | string | 'check' | `check` 命令导出的相关文件的名称 |

## 命令详细说明

### help

使用 `auto help` 可以在命令行界面获取各个子命令的说明

```sh
>auto help

Usage: auto [options] [command]

A CLI to help you transform your project to an internationalization project automatically.

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  init                         Init yo-auto-i18n, generate an new default config file automatically.
  trans [options] [transPath]  Transform a single file or all files.
  update [options]             Update other language JSON files by base language JSON file
  genlsx                       Generate an Xlsx file by language JSON files, the frirt line of in the first sheet of the xlsx will have all JSON files names and the
                               `key`
  check                        Check weather all word has been transformed or not
  help [command]               display help for command
```

### init

```sh
> auto help init

Usage: auto init [options]

Init yo-auto-i18n, generate an new default config file automatically.

Options:
  -h, --help  display help for command
```

`auto init` 会根据你的项目情况进行初始化配置, 比如查找你的 locales 下的 json 文件为你修改配置语言包种类字段 `locales` 以及中文语言字段 `baseLocale`, 会检测你的项目是否配置 eslint 从而选择是否在修改文件进行格式化。

生成的配置文件名为 `auto.config.cjs`, 可以在 [配置字段](#配置字段) 看到对于各项配置更加详细的说明。

当你的项目中已经存在了 yo-auto-i18n 的配置后，再次运行该命令的时候将跳过初始化。

### trans

```sh
> auto help trans

Usage: auto trans [options] [transPath]

Transform a single file or all files.

Arguments:
  transPath                file or directory path

Options:
  --modify                 whether to modify on the source file
  -t, --template <string>  template JSON file which inclues all language key
  -h, --help               display help for command
```

运行该命令将项目中所有文件中的中文替换成 i18n 国际化标记，包括范围可以在 [`AutoConfig.includes`](#配置字段) 配置。该命令在使用的时候分为预览模式和修改模式。

预览模式（默认），预览模式会分析你所有文件中存在的中文，并提取到一个 json 文件中导出，文件名和导出地址可以在 [`AutoConfig`](#配置字段)中 配置。

导出的文件的主要目的是让你自定义各个中文在语言包中的 key, 当你定义好了所有中文对应的 key 后，使用修改模式进行 i18n 国际化标记替换，修改模式使用选项 `--modify` 开启，可以使用可选选项 `-t, --template <string>` 携带你定义好的包含中文 key 的 json 文件。当然你可能不想一个个定义，这个时候未配置中文将通过将中文转换为拼音的方式生成 key, 重复的 key 会加上递增数字，例如未配置的中文 "你好" 的 key 会是 `ni-hao`。

考虑到市面上 i18n 库多种多样以及不同类型的文件的导入各不相同，你可以为每种拓展名文件自定义 i18n 库的调用对象, 方法名, 方法定义 以及 第三方包的导入。详见 [I18nCallRule](#i18ncallrule)

示例：

```shell
auto transAll
auto transAll -t ./src/keyTemplatePath.json --modify
```

对所有的文件进行修改可能是一件不那么让人放心的事情，所以 `auto trans` 的可选参数 `transPath` 支持你提供一个目录或者文件，那么上面的操作将会在你提供的目录或者文件中进行。

注意：**该中文替换不一定能完全正确的处理的你的文件，请在运行时候先保存提交你的代码。防止出现代码丢失的问题**

### update

```sh
> auto help update

Usage: auto update [options]

Update other language JSON files by base language JSON file

Options:
  -t, --templateXlsx <string>  update language JSON files by the Xlsx template file, the frirt line of the first sheet should have all locales names and the `key`
                               (default: "")
  -h, --help                   display help for command
```

`update` 命令会根据中文语言包的结构更新其他语言包的 json 文件。对于新增的, 那些其他语言包没有的 `key` 会使用 `AutoConfig.transLacaleWord` 新增，没有配置 `AutoConfig.transLacaleWord` 时，会使用中文的内容并加上一个未翻译标识的前缀 `AutoConfig.untransSymbol` 。对于在主要语言包删除的 `key`, 其他语言包会删除，并提示你。

有了这个命令，你只需要维护中文 json 语言包的结构，其它的 json 语言包使用该命令自动更新, 而不是每个 json 语言包逐个修改。

#### 参数 -t, --templateXlsx

参数 -t, --templateXlsx 支持提供一个 xlsx 模版文件更新非中文语言包的 json 文件，需要注意的是 xlsx 文件每个 sheet 的第一行需要包含 **`locales` 以及 `key` 作为表头**。

运行时会先根据中文语言包的结构更新其他语言包的 json 文件，在根据 xlsx 模版文件更新非中文语言包的 json 文件。

示例：

```shell
auto update -t ./src/keyTemplatePath.xlsx
```

### genlsx

```sh
> auto help genlsx

Usage: auto genlsx [options]

Generate an Xlsx file by language JSON files, the frirt line of in the first sheet of the xlsx will have all JSON files names and the `key`

Options:
  -h, --help  display help for command
```

将所有的语言包导出为一个xlsx文件，第一行需要会包含`locales`以及 `key` 作为表头, 生成的地址可在 [`AutoConfig.outputFileDir`](#配置字段) 配置, 生成的文件的名称可在 [`AutoConfig.outputXlsxNameBy.genXlsx`](#配置字段) 配置。

### check

```sh
> auto help check

Usage: auto check [options]

Check weather all word has been transformed or not

Options:
  -h, --help  display help for command
```

检测在项目中使用的语言包是否已经完全翻译, 检测范围可以在 [`AutoConfig.includes`](#配置字段) 配置, 生成的文件的名称可在 [`AutoConfig.outputXlsxNameBy.check`](#配置字段) 配置。鉴于不同的 i18n库可能使用一些额外的使用方法，比如 vue-i18n 使用中的下面这个例子：

```js
createVNode(
  Translation,
  {
    keypath: 'gameConfig.confirmDeleteActivity',
    tag: 'span',
    i18n: i18n.global,
  }
)
```

这个时候通过在 [`AutoConfig.i18nCallRules`](#配置字段)  配置的 `i18nCallRules` 来匹配代码中的语言包 key 中就无法匹配到 `"gameConfig.confirmDeleteActivity"`, 这个时候你可以通过定义额外的匹配代码中的语言包 key的正则表达式 [`AutoConfig.checkUsageMatchAppend`](#配置字段) , 从而全面覆盖到其他的情况中的存在语言包  key，上面的例子可以如下配置：

```
{
  // ...
  "checkUsageMatchAppend": [/\Wkeypath:(?:\s+)?['"]([\w\\.]+)["']/gm]
  // ...
}
```

### revert

```sh
> auto help revert

Usage: auto revert [options] <revertPath>

revert a transformed file or files in a directory

Arguments:
  revertPath             file or directory path

Options:
  -t, --target <string>  the target language when revert
  -h, --help             display help for command
```

通过参数 `revertPath` 将一个 i18n 国际化标记的文件或者一个目录下的所有文件进行还原，还原时候使用 `target` 在的 JSON 文件中的文案替换 i18n 中的 `key`, 当目标语言 `target` 不存在或为空时，使用项目的 [`AutoConfig.baseLocale`](#配置字段)。还原的文件会导出到
[`AutoConfig.outputFileDir`](#配置字段) 下的文件夹 `revert-{name}` 下。

## 转换效果示例

### react 转换示例

转换前

```jsx
import { useState } from 'react'

/*yo-auto-i18n-ignore*/
const b = '被忽略提取的文案'

function Example() {
  const [msg, setMsg] = useState('你好')

  return (
    <div>
      <p title="标题">{msg + '呵呵'}</p>
      <button onClick={() => setMsg(msg + '啊')}>点击</button>
    </div>
  )
}

export default Example
```

配置中文 key, 支持嵌套

```json
{
  "hi": "你好",
  "title": "标题",
  "hehe": "呵呵",
  "a": "啊",
  "click": "点击"
}
```

转换后

```jsx
import { t } from 'i18n'
import { useState } from 'react'

/*yo-auto-i18n-ignore*/
const b = '被忽略提取的文案'

function Example() {
  const [msg, setMsg] = useState(t('hi'))
  return (
    <div>
      <p title={t('title')}>{msg + t('hehe')}</p>
      <button onClick={() => setMsg(msg + t('a'))}>{t('click')}</button>
    </div>
  )
}
export default Example
```

### vue 转换示例

完整的示例可见 [vue-demo](https://gitcn.yostar.net:8888/hangxing.bao/yo-auto-i18n/-/tree/main/packages/core/demo/vue-demo)

转换前

```vue
<script setup>
const handleClick = () => {
  console.log(this.$t('dianle'))
}
</script>

<template>
  <div label="标签" :title="`${1}标题`">
    <p title="测试注释">
      内容
    </p>
    <button @click="handleClick('信息')">
      点乐
    </button>
  </div>
</template>
```

未配置中文 key 转换后

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const handleClick = () => {
  console.log(this.$t('dianle'))
}
</script>

<template>
  <div :label="t('biaoqian')" :title="1 + t('biaoti')">
    <p :title="t('ceshizhushi')">
      {{ $t('neirong') }}
    </p>
    <button @click="handleClick(t('xinxi'))">
      {{ $t('dianle-2') }}
    </button>
  </div>
</template>
```

## 通配符语法

本项目使用通配符匹配库为 [fast-glob](https://github.com/mrmlnc/fast-glob)

### 基础语法

- An asterisk (`*`) — matches everything except slashes (path separators), hidden files (names starting with `.`).
- A double star or globstar (`**`) — matches zero or more directories.
- Question mark (`?`) – matches any single character except slashes (path separators).
- Sequence (`[seq]`) — matches any character in sequence.

示例:

- `src/**/*.js` — matches all files in the `src` directory (any level of nesting) that have the `.js` extension.
- `src/*.??` — matches all files in the `src` directory (only first level of nesting) that have a two-character extension.
- `file-[01].js` — matches files: `file-0.js`, `file-1.js`.

更多信息可以参考 [fast-glob 的 Pattern syntax 说明](https://github.com/mrmlnc/fast-glob#pattern-syntax)

## 注意事项

- 使用 ts 的 vue 项目如果出现下面形式语法

```ts
@Component
export default class Home extends Vue {}
```

请手动改写成

```ts
@Component
class Home extends Vue {}
export default Home
```

避免解析时报错

- vue 项目如果出现下面形式语法

```vue
<AAA v-for="item of ['中文', '中文2']" />
```

这种格式目前无法成功解析，请手动将 v-for 中的数组表达式提取到 script 中

- vue模版如果存在多个最外层注释，在转换之后只会保留文件头部的最外层注释。解决这个问题，你可以把所有的最外层注释移动到最上面，这个问题会在 1.0.0 后的版本更新。

- vue 模版解析过程中如果遇到元素的属性值是 `''`, 例如 `<Comp propName=''/>`, 转换后会变成 `<Comp propName/>`, 这个问题出现的原因是这两种情况在解析之后都是得如下的解析结果：

```
{
  propName: ''
}
```

从而在还原的时候无法确实是否应该加上 `=''` 的后缀（这个问题会在 1.0.0 后的版本更新）。

为了防止这种问题对你的项目影响，你可以在`trans`命令中加上命令选项 `--verbose`, 添加该命令项之后解析遇到这种情况会打印出转换的情况，以供你判断是否进行了错误的解析。

- vue 模版解析过程中如果只是在 `<template>` 中出现了需要替换的中文，在 `<script>` 中没有出现需要替换的中文，配置的 `I18nCallRule.importDeclaration` 和 `I18nCallRule.variableDeclaration` 不会被引入，您可能需要手动添加引用和声明

这个问题会在 1.0.0 后的版本更新。
