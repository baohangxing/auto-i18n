interface Packages {
  path: string
  name: string
}

const packages: Packages[] = [{
  path: './packages/cli',
  name: '@h1mple/auto-i18n-cli',
}, {
  path: './packages/core',
  name: '@h1mple/auto-i18n-core',
}, {
  path: './packages/vsce',
  name: 'auto-i18n',
}]

export { packages }
