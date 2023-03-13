import { describe, expect, it } from 'vitest'
import type { RevertOptions } from '../../src'
import { initJsParse, revertVue } from '../../src'

const genRevertOptions = (): RevertOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
    },
    parse: initJsParse(),
    getWordByKey: (str: string) => `Chinese of ${str}`,
  }
}

describe('#revertVue', () => {
  it('should revert all i18n keys in template and setupScript', async () => {
    const content = `
      <template>
        <div>这是{{t('dazigao')}}</div>
      </template>
      <script setup>
      let title = t('title')
      </script>
      <style>
      div{ width: 10px; }
      </style>
      `
    const code = revertVue(content, genRevertOptions())
    expect(code).toMatchSnapshot()
  })

  it('should revert all i18n keys in script', async () => {
    const content = `
      <script>
      let title = t('title')
      </script>
      `
    const code = revertVue(content, genRevertOptions())
    expect(code).toMatchSnapshot()
  })

  it('should revert all i18n keys attributes of component', async () => {
    const content = `
      <template>
        <comp v-if="t('title')"> 这是 {{t('dazigao')}}</comp>
        <comp disabled :propA="''" @click=""> 这是 {{t('dazigao')}}</comp>
        <comp @click="()=>{a=t('title')}" :title="t('title')">这是{{t('dazigao')}}</comp>

        <!--auto-i18n-ignore-->
        <comp v-if="t('title')"> 这是 {{t('dazigao')}}</comp>
        <!--auto-i18n-ignore-->
        <comp disabled :propA="''" @click=""> 这是 {{t('dazigao')}}</comp>
        <!--auto-i18n-ignore-->
        <comp @click="()=>{a=t('title')}" :title="t('title')">这是{{t('dazigao')}}</comp>
      </template>
      <script>
      let a = ''
      </script>
      `
    const code = revertVue(content, genRevertOptions())
    expect(code).toMatchSnapshot()
  })

  it('should revert no i18n keys', async () => {
    const content = `
      <template>
        <!--auto-i18n-ignore-->
        <comp v-if="t('title')">这是{{t('dazigao')}}</comp>
      </template>
      `
    const code = revertVue(content, genRevertOptions())
    expect(code).toMatchSnapshot()
  })
})
