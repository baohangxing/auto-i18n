import type {
  AutoBaseConfig, FileExtension,
  I18nCallRule, TransInterpolationsMode,
} from '@h1mple/auto-i18n-core'

export interface AutoConfig extends AutoBaseConfig {
  /**
   * Glob patterns to match local language JSON files.
   * Using `fast-glob`'s glob patterns, see deteils: https://github.com/mrmlnc/fast-glob.
   *
   * @example ['lang/locales/**']
   */
  localesJsonDirs: string[] | string

  /**
   * Language JSON files names used, the language will be skipped if it is not in `locales`.
   *
   * @example [`ja-jp`, `zh-cn`]
   */
  locales: string[]

  /**
   * The base language JSON files name in your project,
   * and make sure it is in the `localesJsonDirs`.
   *
   * @example `zh-cn`
   */
  baseLocale: string

  /**
   * Symbol of the not translated words
   *
   * @param locale one name of the `locales`
   * @returns
   */
  untransSymbol: (locale: string) => string

  /**
   * Translate word function when not translated.
   */
  transLacaleWord?: (word: string, locale: string, toLocale: string) => Promise<string>

  /**
    * Glob patterns to match files that CLI plans to transform,
    * Using `fast-glob`'s glob patterns, see deteils: https://github.com/mrmlnc/fast-glob.
    *
    * @example ["src/*.{vue}", "view/**"]
    */
  includes: string[]

  /**
    * Directory path of output files,
    * the default directory path is your project root path
    *
    * @default `./ `
    */
  outputFileDir: string

  /**
   * Interpolations mode of i18n message format syntax.
   *
   * For example: Vue I18n supports interpolation using placeholders {} like "Mustache".
   * see -> https://vue-i18n.intlify.dev/guide/essentials/syntax.html#interpolations
   */
  transInterpolationsMode: TransInterpolationsMode

  i18nCallRules: Record<FileExtension, I18nCallRule>

  /**
   * Whether to format files or not when editing or new.
   * Please add Eslint and configure it, if u set true.
   * @default false
   */
  autoFormat: boolean

  /**
    * Glob patterns to match files that need formating.
    *
    * Using `fast-glob`'s glob patterns, see deteils: https://github.com/mrmlnc/fast-glob.
    *
    * @example ["*.{vue}"]
    */
  autoFormatRules: string[]

  /**
   * Regular expression to match i18n key in code.
   *
   * @example [/\Wkeypath:(?:\s+)?['"]([\w\\.]+)["']/gm]
   */
  checkUsageMatchAppend: RegExp[]

  /**
   *  Append names of the output Xlsx files.
   */
  outputXlsxNameBy: {
    /**
     * Name of files which created by command `auto-i18n genXlsx`
     *
     * @default `genXlsx`
     */
    genXlsx: string

    /**
     * Name of files which created by command `auto-i18n trans`.
     *
     * @default `trans`
     */
    trans: string

    /**
     * Name of files which created by command `auto-i18n check`.
     *
     * @default `check`
     */
    check: string
  }
}

export interface TransCommandOption {
  transPath: string
  modifyMode: boolean
  templateFile: string
}

export interface RevertCommandOption {
  revertPath: string

  /**
   * Language JSON files name
   * @example `zh-cn`
   */
  target: string
}
