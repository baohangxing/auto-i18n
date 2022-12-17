interface AutoCongfig {
    /**
     * local Locales-Json Path, all user json file will found in this path
     * 
     * @example `./src/lang/locales` | [`/Users/XXX/GM/src/lang/locales`]
     */
    localesJsonPath: string | string[];

    /**
     * locales used, the locale will not trans if not in `locales`
     * 
     * @example [`ja-jp`, `zh-cn`]
     */
    locales: string[];

    /**
     * the base locale in your project, make sure it is in `locales` and all words has configured in locale-Json file
     *
     * @example `zh-cn`
     */
    baseLocale: string;

    /**
     * 
     * @param word 
     * @param locale current locale like `ja-jp`
     * @returns
     */
    transLacaleWord: (word: string, locale: string) => string;


    /**
     * files to auto trans, using fast-glob rule
     * 
     * see deteils: https://github.com/mrmlnc/fast-glob
     * 
     * @example ["src/*.{vue}", "view/**"]
     */

    includes: string[]

}

export type { AutoCongfig }