import { describe, expect, it } from 'vitest'
import type { I18nCallRule, RevertOptions } from '../../src'
import { initJsParse, revertJs } from '../../src'

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
    getWordByKey: (str: string) => `Chinese of ${str}`,
  }
}

describe('#revertJs', async () => {
  it('should get all reverted words in js', () => {
    const content = 'const a = t(\'title\')'
    const code = revertJs(content, genRevertOptions())

    expect(code).toMatchSnapshot()
  })

  it('should get all reverted words with transCaller and transIdentifier', () => {
    const content = 'const a = this.trans(\'title\')'
    const code = revertJs(content, genRevertOptions({ transCaller: 'this', transIdentifier: 'trans' }))

    expect(code).toMatchSnapshot()
  })

  it('should get all reverted words with transCaller and transIdentifier', () => {
    const content = 'const a = i18n.$t(\'title\')'
    const code = revertJs(content, genRevertOptions({ transCaller: 'i18n', transIdentifier: '$t' }))

    expect(code).toMatchSnapshot()
  })

  it('should get no reverted words in string', () => {
    const content = 'const a = `t(\'title\')`'
    const code = revertJs(content, genRevertOptions())

    expect(code).toMatchSnapshot()
  })
})
