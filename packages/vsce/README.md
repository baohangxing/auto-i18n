<br />

<div align="center">
<p align="center">
<img src="https://z4a.net/images/2023/03/07/logo.png" style="width:300px" />
</p>
</div>

<div align="center">
<p align="center">
一个可以快速将中文项目中的中文替换成 i18n 国际化标记的 vscode 插件。
</p>
</div>

## 如何使用

在使用前请在先安装 [@yostar/auto-i18n-cli](https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/tree/main/packages/cli), 并进行初始的配置（后续版本会在插件中集成所有的功能）

使用前需要将`AutoConfig`中的`localesJsonDirs`进行重新配置，例如：

```txt
localesJsonDirs: [
    "/Users/code/work/project-name/src/lang/locales/**.json",
],
```

之后在 vscode 中安装本插件，进入想要进行操作的文件中，对应的操作会在邮件的菜单中出现。

## 演示

![example.gif](https://z4a.net/images/2023/03/07/example.gif)

## issues

任何问题 请提 issues: <https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/issues>

## 问题

- 为何这个 package 使用 yarn 进行包管理, 而不是统一使用 pnpm: <https://github.com/microsoft/vscode-vsce/issues/421>
