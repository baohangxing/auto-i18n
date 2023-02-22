import { describe, expect, it } from 'vitest'
import type { RevertOptions } from '../../src'
import { initJsParse, revertVue } from '../../src'
import { playground } from '../_helps/playground'

const genRevertOptions = (): RevertOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
    },
    parse: initJsParse(),
    locale: 'cn',
  }
}

describe('#revertVue', () => {
  it('should revert all i18n keys in template and setupScript', async () => {
    let code = ''
    await playground(async () => {
      const content = `
      <template>
        <div>这是{{t('dazigao')}}</div>
      </template>
      <script setup>
      let title = t('title')
      </script>
      `
      code = revertVue(content, genRevertOptions())
    })
    expect(code).toMatchSnapshot()
  })

  it('should revert all i18n keys in script', async () => {
    let code = ''
    await playground(async () => {
      const content = `
      <script>
      let title = t('title')
      </script>
      `
      code = revertVue(content, genRevertOptions())
    })
    expect(code).toMatchSnapshot()
  })

  it('should revert all i18n keys attributes of component', async () => {
    let code = ''
    await playground(async () => {
      const content = `
      <template>
        <comp v-if="t('title')"> 这是 {{t('dazigao')}}</comp>
        <comp @click="()=>{a=t('title')} :title="t('title')">这是{{t('dazigao')}}</comp>
      </template>
      `
      code = revertVue(content, genRevertOptions())
    })
    expect(code).toMatchSnapshot()
  })

  it('should revert no i18n keys', async () => {
    let code = ''
    await playground(async () => {
      const content = `
      <template>
        <!--auto-i18n-ignore-->
        <comp v-if="t('title')">这是{{t('dazigao')}}</comp>
      </template>
      `
      code = revertVue(content, genRevertOptions())
    })
    expect(code).toMatchSnapshot()
  })
})
