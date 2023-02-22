import { describe, expect, it } from 'vitest'
import type { GetI18nKeysOptions } from '../../src'
import { getVueI18nKeys, initJsParse } from '../../src'

const genGetI18nKeysOptions = (): GetI18nKeysOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
    },
    parse: initJsParse(),
  }
}

describe('#getVueI18nKeys', () => {
  it('should get all i18n keys', async () => {
    const code = `
    <template>
      <div>这是{{t('test')}}</div>
    </template>
    <script setup>
    let title = t('title')
    </script>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())
    expect(list.length).toBe(2)
    expect(list).toContain('title')
    expect(list).toContain('test')
  })

  it('should get all i18n keys', async () => {
    const code = `
    <script>
    let title = t('title')
    </script>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())
    expect(list).toEqual(['title'])
  })

  it('should get all i18n keys', async () => {
    const code = `
    <template>
      <comp :title="t('title')">这是{{t('test')}}</comp>
    </template>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())

    expect(list.length).toBe(2)
    expect(list).toContain('title')
    expect(list).toContain('test')
  })

  it('should get all i18n keys', async () => {
    const code = `
    <template>
      <comp @click="()=>{a=t('title')}">这是{{t('test')}}</comp>
    </template>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())

    expect(list.length).toBe(2)
    expect(list).toContain('title')
    expect(list).toContain('test')
  })

  it('should get all i18n keys', async () => {
    const code = `
    <template>
      <comp v-if="t('title')">这是{{t('test')}}</comp>
    </template>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())

    expect(list.length).toBe(2)
    expect(list).toContain('title')
    expect(list).toContain('test')
  })

  it('should get no i18n keys', async () => {
    const code = `
    <template>
      <!--auto-i18n-ignore-->
      <comp v-if="t('title')">这是{{t('test')}}</comp>
    </template>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())

    expect(list).toEqual([])
  })

  it('should get all i18n keys', async () => {
    const code = `
    <template>
      <comp v-if="{a:t('title')}">这是{{t('test')}}</comp>
    </template>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())

    expect(list.length).toBe(2)
    expect(list).toContain('title')
    expect(list).toContain('test')
  })

  it('should get no i18n keys if parse vue error', async () => {
    const code = `
    <template>
      <comp v-if="{a:t('title')}">这是{{t('test')}} 
    </template>
    `
    const list = getVueI18nKeys(code, genGetI18nKeysOptions())

    expect(list).toEqual([])
  })
})
