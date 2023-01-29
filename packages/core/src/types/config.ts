import type { I18nCallRule } from './transform'

export type FileExtension = 'js' | 'ts' | 'cjs' | 'mjs' | 'jsx' | 'tsx' | 'vue'

export type I18nCallRules = Record<FileExtension, I18nCallRule>

export interface AutoConfig {
  /**
   * To match local Json paths, all Json file will be used.
   * Please using `fast-glob`'s glob patterns, see deteils: https://github.com/mrmlnc/fast-glob.
   *
   * @example ['lang/locales/**']
   */
  localesJsonDirs: string[] | string

  /**
   * Locale names used, the locale will be skipped if not in `locales`,
   * the locale names is Json file's name
   *
   * @example [`ja-jp`, `zh-cn`]
   */
  locales: string[]

  /**
   * The base locale in your project, make sure it in the `localesJsonDirs`
   *
   * @example `zh-cn`
   */
  baseLocale: string

  /**
   * Symbol of not translated word
   *
   * @param locale one locale of `locales`
   * @returns
   */
  untransSymbol: (locale: string) => string

  /**
   * Translate word rule when not translated
   *
   * @param word
   * @param locale the word current locale, your baseLocale
   * @param toLocale to translate locale like `ja-jp`
   * @returns
   */
  transLacaleWord?: (word: string, locale: string, toLocale: string) => Promise<string>

  /**
    * Files to auto translated includes,
    * Please using `fast-glob`'s glob patterns, see deteils: https://github.com/mrmlnc/fast-glob.
    *
    * @example ["src/*.{vue}", "view/**"]
    */
  includes: string[]

  /**
    * Directory of output files,
    * the default output filed directory path is your project path
    *
    * @default `./ `
    */
  outputFileDir: string

  i18nCallRules: Record<FileExtension, I18nCallRule>

  /**
   * Weather to format files or not.
   * Please add Eslint and configure it, if u set true.
   * @default false
   */
  autoFormat: boolean

  /**
    * files to format, using fast-glob glob patterns
    * Please using `fast-glob`'s glob patterns, see deteils: https://github.com/mrmlnc/fast-glob.
    *
    * @example ["*.{vue}"]
    */
  autoFormatRules: string[]

  /**
   *  Name of output Xlsx file
   */
  outputXlsxNameBy: {
    /**
     * name of file which created by command `auto genXlsx`
     *
     * @default `genXlsx`
     */
    genXlsx: string

    /**
     * name of file which created by command `auto trans`
     *
     * @default `trans`
     */
    trans: string

    /**
     * name of file which created by command `auto check`
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

export interface LangJson {
  name: string
  path: string
}
