const playgroundName = '__testPlaygroundName__'

module.exports = {
  localesJsonDirs: [`**/${playgroundName}/locales/**.json`],
  locales: ['cn', 'en'],
  baseLocale: 'cn',
  untransSymbol: (locale) => {
    return `[${locale.toUpperCase()}]`
  },
  includes: ['src/**/*.{js,cjs,ts,mjs,jsx,tsx,vue}'],
  outputFileDir: `./test/_helps/playground/${playgroundName}/output`,
  transInterpolationsMode: 'NamedInterpolationMode',
  checkUsageMatchAppend: [],
  autoFormat: false,
  autoFormatRules: ['src/**/*.{js,cjs,ts,mjs,jsx,tsx,vue}'],
  outputXlsxNameBy: { trans: 'trans', genXlsx: 'genXlsx', check: 'check' },
}
