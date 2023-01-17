import type { ParseResult, PluginItem } from '@babel/core'
import babel from '@babel/core'

import pluginSyntaxJSX from '@babel/plugin-syntax-jsx'
import pluginSyntaxProposalOptionalChaining from '@babel/plugin-proposal-optional-chaining'
import pluginSyntaxClassProperties from '@babel/plugin-syntax-class-properties'
import pluginSyntaxDecorators from '@babel/plugin-syntax-decorators'
import pluginSyntaxObjectRestSpread from '@babel/plugin-syntax-object-rest-spread'
import pluginSyntaxAsyncGenerators from '@babel/plugin-syntax-async-generators'
import pluginSyntaxDoExpressions from '@babel/plugin-syntax-do-expressions'
import pluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import'
import pluginSyntaxExportExtensions from '@babel/plugin-syntax-export-extensions'
import pluginSyntaxFunctionBind from '@babel/plugin-syntax-function-bind'

type presetsType = PluginItem[] | undefined
type pluginsType = PluginItem[] | undefined

const initParse = (babelPresets: presetsType = [], babelPlugins: pluginsType = []) => {
  return function (code: string): ParseResult | null {
    return babel.parseSync(code, {
      ast: true,
      configFile: false,
      presets: babelPresets,
      plugins: [
        pluginSyntaxJSX,
        pluginSyntaxProposalOptionalChaining,
        pluginSyntaxClassProperties,
        [pluginSyntaxDecorators, { decoratorsBeforeExport: true }],
        pluginSyntaxObjectRestSpread,
        pluginSyntaxAsyncGenerators,
        pluginSyntaxDoExpressions,
        pluginSyntaxDynamicImport,
        pluginSyntaxExportExtensions,
        pluginSyntaxFunctionBind,
        ...babelPlugins,
      ],
    })
  }
}

export { initParse }
