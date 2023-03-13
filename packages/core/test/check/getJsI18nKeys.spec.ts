import { describe, expect, it } from 'vitest'
import type { GetI18nKeysOptions, I18nCallRule } from '../../src'
import { getJsI18nKeys, initJsParse } from '../../src'

const genGetI18nKeysOptions = (rule?: Partial<I18nCallRule>): GetI18nKeysOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
      ...rule,
    },
    parse: initJsParse(),
  }
}

describe('#getJsI18nKeys', () => {
  it('should get all i18n keys', async () => {
    const code = 'const a = t(\'test\')'
    const list = getJsI18nKeys(code, genGetI18nKeysOptions())
    expect(list).toEqual(['test'])
  })

  it('should get all i18n keys with transCaller and transIdentifier', async () => {
    const code = 'const a = this.trans(\'test\')'
    const list = getJsI18nKeys(code, genGetI18nKeysOptions({ transCaller: 'this', transIdentifier: 'trans' }))
    expect(list).toEqual(['test'])
  })

  it('should get all i18n keys with transCaller and transIdentifier', async () => {
    const code = 'const a = i18n.$t(\'test\')'
    const list = getJsI18nKeys(code, genGetI18nKeysOptions({ transCaller: 'i18n', transIdentifier: '$t' }))
    expect(list).toEqual(['test'])
  })

  it('should get no i18n keys in string', async () => {
    const code = 'const a = `t(\'test\')`'
    const list = getJsI18nKeys(code, genGetI18nKeysOptions())
    expect(list).toEqual([])
  })

  it('should get all i18n keys in template', async () => {
    const code = 'const a = t(`test`) '
    const list = getJsI18nKeys(code, genGetI18nKeysOptions())
    expect(list).toEqual(['test'])
  })

  it('should get all i18n keys in function argument', async () => {
    const code = 't(t(\'test\'))'
    const list = getJsI18nKeys(code, genGetI18nKeysOptions())
    expect(list).toEqual(['test'])
  })
})
