interface Packages {
  path: string
  name: string
}

const packages: Packages[] = [{
  path: './packages/cli',
  name: '@yostar/auto-i18n-cli',
}, {
  path: './packages/core',
  name: '@yostar/auto-i18n-core',
}, {
  path: './packages/vsce',
  name: 'auto-i18n',
}]

export { packages }
