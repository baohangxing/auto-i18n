import { LangJson } from ".";

interface AutoConfig {
    /**
     * local Locales-Json directory Paths, all user json file should found in this paths
     * 
     * @example `./src/lang/locales` | [`/Users/XXX/GM/src/lang/locales`]
     */
    localesJsonDirs: string | string[];

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
     * translate word rule when not translated
     * 
     * @param word
     * @param locale the word current locale, your baseLocale
     * @param toLocale to translate locale like `ja-jp`
     * @returns
     */
    transLacaleWord: (word: string, locale: string, toLocale: string) => Promise<string>;


    /**
     * files to auto trans, using fast-glob rule
     * 
     * see deteils: https://github.com/mrmlnc/fast-glob
     * 
     * @example ["src/*.{vue}", "view/**"]
     */

    includes: string[]


    /**
     * output filed directory path, 
     * the default output filed directory path is your project path
     * 
     * @default `./`
     */
    outputFileDir?: string
}


interface Config {
    baseLangJson: LangJson
    otherLangJsons: LangJson[]
}

export type { AutoConfig, Config }