import { describe, expect, it } from 'vitest'
import type { I18nCallRule, RevertOptions } from '../../src'
import { initJsParse, revertJs } from '../../src'
import { playground } from '../_helps/playground'

const genRevertOptions = (rule?: Partial<I18nCallRule>): RevertOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
      ...rule,
    },
    parse: initJsParse(),
    locale: 'cn',
  }
}

describe('#revertJs', () => {
  it('should get all i18n keys', async () => {
    let code = ''
    await playground(async () => {
      const content = 'const a = t(\'title\')'
      code = revertJs(content, genRevertOptions())
    })

    expect(code).toMatchSnapshot()
  })

  it('should get all i18n keys', async () => {
    let code = ''
    await playground(async () => {
      const content = 'const a = this.trans(\'title\')'
      code = revertJs(content, genRevertOptions({ transCaller: 'this', transIdentifier: 'trans' }))
    })
    expect(code).toMatchSnapshot()
  })

  it('should get all i18n keys', async () => {
    let code = ''
    await playground(async () => {
      const content = 'const a = i18n.$t(\'title\')'
      code = revertJs(content, genRevertOptions({ transCaller: 'i18n', transIdentifier: '$t' }))
    })
    expect(code).toMatchSnapshot()
  })

  it('should get all i18n keys', async () => {
    let code = ''
    await playground(async () => {
      const content = 'const a = `t(\'title\')`'
      code = revertJs(content, genRevertOptions())
    })
    expect(code).toMatchSnapshot()
  })
})
