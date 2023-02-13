import type { ParseResult } from '@babel/core'

export interface I18nCallRule {
  /** transCaller of transIdentifier
     *  @default ''
     */
  transCaller: string

  /** function name of `t`
     *  @default 't'
     */
  transIdentifier: string

  variableDeclaration: string

  /**
    * import i18n t Declaration
    */
  importDeclaration: string
}

export interface TransformOptions {
  rule: I18nCallRule
  parse: (code: string) => ParseResult | null

  /** handle js in vue */
  isJsInVue?: boolean
}

export type RevertOptions = TransformOptions & {
  locale: string
}
