export interface I18nCallRule {
  /** caller of functionName
       *  @default ''
      */
  caller: string
  /** function name of `t`
       *  @default 't'
      */
  functionName: string

  definedDeclaration: string
  /**
       * import i18n t Declaration
       */
  importDeclaration: string
}

export type FileExtension = 'js' | 'ts' | 'cjs' | 'mjs' | 'jsx' | 'tsx' | 'vue'

export interface AutoConfig {
  /**
      * local Locales-Json directory Paths, all user json file should found in this paths
      *
      * @example [`/Users/XXX/GM/src/lang/locales`]
      */
  localesJsonDirs: string[] | string

  /**
       * locales used, the locale will not trans if not in `locales`
       *
       * @example [`ja-jp`, `zh-cn`]
       */
  locales: string[]

  /**
       * the base locale in your project, make sure it is in `locales` and all words has configured in locale-Json file
       *
       * @default `zh-cn`
       */
  baseLocale: string

  /**
       *
       * @param locale
       * @returns
       */
  untransSymbol: (locale: string) => string

  /**
 * translate word rule when not translated
 *
 * @param word
 * @param locale the word current locale, your baseLocale
 * @param toLocale to translate locale like `ja-jp`
 * @returns
 */
  transLacaleWord?: (word: string, locale: string, toLocale: string) => Promise<string>

  /**
      * files to auto trans, using fast-glob rule
      *
      * see deteils: https://github.com/mrmlnc/fast-glob
      *
      * @example ["src/*.{vue}", "view/**"]
      */
  includes: string[]

  /**
       * exclude files to auto trans, using fast-glob rule
       *
       * see deteils: https://github.com/mrmlnc/fast-glob
       *
       * @example  ['**\/node_modules/**\/*']
       */
  exclude: string[]

  /**
       * output filed directory path,
       * the default output filed directory path is your project path
       *
       * @default `./ `
       */
  outputFileDir: string

  i18nCallRules: Record<FileExtension, I18nCallRule>
}

export interface TransCommandOption {
  filePath: string
  generateNewFile: boolean
  newFileName: string
}

export interface LangJson {
  name: string
  path: string
}
