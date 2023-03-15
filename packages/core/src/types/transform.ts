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

export type FileExtension = 'js' | 'ts' | 'cjs' | 'mjs' | 'jsx' | 'tsx' | 'vue'

export type TransInterpolationsMode = 'NamedInterpolationMode' | 'ListInterpolationMode'

export type I18nCallRules = Record<FileExtension, I18nCallRule>

export interface Collector {

  add: (str: string) => void

  getKey: (str: string) => string

}

export interface LangJson {

  /**
   * Language JSON files name
   * @example `zh-cn`
   */
  name: string

  path: string
}
