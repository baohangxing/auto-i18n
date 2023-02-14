import type { ParseResult } from '@babel/core'

export interface I18nCallRule {
  /** TransCaller of the `transIdentifier`
     *  @default ''
     */
  transCaller: string

  /** Identifier name of the transform function of i18n.
    * For example, the identifier name of `vue-i18n` is `t`
    */
  transIdentifier: string

  variableDeclaration: string

  /**
    * Declaration that import i18n
    */
  importDeclaration: string
}

export interface TransformOptions {
  rule: I18nCallRule
  parse: (code: string) => ParseResult | null

  /**
   * Whether handle js in vue
   */
  isJsInVue?: boolean
}

export type RevertOptions = TransformOptions & {
  locale: string
}
