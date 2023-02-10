const playgroundName = '__testPlaygroundName__'

module.exports = {
  localesJsonDirs: [`**/test/${playgroundName}/locales/**.json`],
  locales: ['cn', 'en'],
  baseLocale: 'cn',
  untransSymbol: (locale) => {
    return `[${locale.toUpperCase()}]`
  },
  includes: ['src/**/*.{js,cjs,ts,mjs,jsx,tsx,vue}'],
  outputFileDir: `./test/${playgroundName}`,
  transInterpolationsMode: 'NamedInterpolationMode',
  checkUsageMatchAppend: [],
  autoFormat: false,
  autoFormatRules: ['src/**/*.{js,cjs,ts,mjs,jsx,tsx,vue}'],
  outputXlsxNameBy: { trans: 'trans', genXlsx: 'genXlsx', check: 'check' },
}
