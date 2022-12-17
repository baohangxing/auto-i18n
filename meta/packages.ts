interface Packages {
  path: string
  name: string
}

const packages: Packages[] = [{
  path: './packages/core',
  name: 'auto-vue-i18n',
}, {
  path: './packages/vue-sfc-gen',
  name: 'vue-sfc-gen',
}]

export { packages }
