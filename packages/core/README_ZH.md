# auto-vue-i18n

这是一个命令工具, 可以快速将vue项目国际化, 除了文本转换, 它还具备翻译导出, 回填以及检测等功能。

[English](./README.md)

## 快速开始

- 第一步: 安装

```sh
npm i auto-vue-i18n
pnpm i auto-vue-i18n #or 
yarn add auto-vue-i18n #or
```

- 第二步: 给你项目添加 [Vue I18n]([Vue I18n | Vue I18n (intlify.dev)](https://vue-i18n.intlify.dev/))，创建 locales文件夹以及多语言json文件

- 第三步: 配置 `auto.config.mjs` / `auto.config.cjs`


举例: 

```js
const config = {
  localesJsonDirs: './src/lang/locales',
  locales: ['ja-jp', 'zh-cn', 'en'],
  baseLocale: 'en',
  includes: [],
}

export default config
```


- 第三步：运行命令

```
npx auto transAll
```

## AutoConfig详细说明

| 字段            | 类型 | 说明 | 默认值 |
| --------------- | ---- | ---- | ------ |
| localesJsonDirs |      |      |        |
| locales         |      |      |        |
|                 |      |      |        |
|                 |      |      |        |
|                 |      |      |        |
| transNewName    |      |      |        |
| generateKey     |      |      |        |
|                 |      |      |        |



## 命令

### trans

```shell
auto trans <fileName> -g -n <newName>
```

将一个输入的文件(`fileName`)提取其中的多语言，生产一个新的文件`newName`，支持的文件为vue, ts, tsx, js, jsx。 

- 参数`-g`/`--gen` 表示是否生成转换后的文件，不添加时候会打印出转换后的结果。

- 参数`-n`/`--name` 表示新生成文件的名称，该参数也可以通过`AutoConfig`的 `transNewName`配置，但参数`-g`/`--gen` 优先级更高。

```shell
#for example
auto trans ./src/App.vue -g -n NewApp
```



### transAll

```shell
auto transAll -p -k <keyTemplatePath>
```

 将 `AutoConfig.includes`所匹配的所有的文件进行提取多语言转换，替代原来的文件，支持的文件为vue, ts, tsx, js, jsx。 

- 参数`-p`/`--preview` 表示预览模式，将不进行替换，而是生成一个xlsx 文件，以供预览，生成的地址可在 `AutoConfig.outputFileDir` 配置。

  **在使用的时候先根据预览生成xlsx， 在手动指定 key, 然后在进行批量处理**

- 参数`-k`/`--keyTemplatePath` 提供一个 JSON-key 的 xlsx文件，转换时候将该语句的 key 写入JSON文件，未提供时，使用`AutoConfig.generateKey` 得到。

```shell
#for example
auto transAll -p
auto transAll -k ./src/keyTemplatePath.xlsx
```

**注意：该命令不一定能完全正确的处理的你的文件，请在运行时候先保存提交你的代码。**



### updateLocalesFromXlsx

```sh
auto updateLocalesFromXlsx <xlsxFile>
```

根据xlsx文件 `xlsxFile` 更新 `AutoConfig.localesJsonDirs` 下的 JSON 文件。

**xlsx文件每个sheet的第一行需要包含`locales`以及 `key` 作为表头**

```shell
#for example
auto updateLocalesFromXlsx ./src/keyTemplatePath.xlsx
```



### updateLocales

根据主要语言包 `AutoConfig.baseLocale`的结构 更新 其他语言包 `AutoConfig.localesJsonDirs` 下的 JSON 文件。对于新增的, 那些其他语言包没有的 `key` 会使用 `AutoConfig.transLacaleWord` 新增。对于在主要语言包删除的 `key`, 其他语言包会删除，并提示你。有了这个命名，你需要维护主要的语言包的文件，而其它的使用该命令自动更新。

```shell
#for example
auto updateLocales
```



### generateXlsx

将所有的语言包导出为一个xlsx文件，第一行需要会包含`locales`以及 `key` 作为表头。生成的地址可在 `AutoConfig.outputFileDir` 配置。

```shell
#for example
auto generateXlsx
```
