import type { FileExtension, I18nCallRule, TransInterpolationsMode } from './transform'

export interface AutoBaseConfig {
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
   * Interpolations mode of i18n message format syntax.
   *
   * For example: Vue I18n supports interpolation using placeholders {} like "Mustache".
   * see -> https://vue-i18n.intlify.dev/guide/essentials/syntax.html#interpolations
   */
  transInterpolationsMode: TransInterpolationsMode

  i18nCallRules: Record<FileExtension, I18nCallRule>

}
