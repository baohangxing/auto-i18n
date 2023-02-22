import { describe, expect, it } from 'vitest'
import type { Collector } from '../../src/types'
import { initJsParse } from '../../src/transform'
import type { TransformJsOptions } from '../../src/transform/transformJs'
import transformJs from '../../src/transform/transformJs'

const genTransOptions = (collector: Collector): TransformJsOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
    },
    parse: initJsParse(),
    replace: true,
    collector,
  }
}

describe('#transform', () => {
  it('transform', async () => {
    const words: string[] = []
    const reslut = transformJs(`
    let title = "标题"
    `, genTransOptions(
      {
        add(str) {
          words.push(str)
        },
        getKey(str: string) {
          return `Key of ${str}`
        },
      }),
    )
    expect(words).toEqual(['标题'])
    expect(reslut.code).toMatchSnapshot()
  })

  it('transform', async () => {
    const words: string[] = []
    const reslut = transformJs(`
    let title = \`标题\`
    `, genTransOptions(
      {
        add(str) {
          words.push(str)
        },
        getKey(str: string) {
          return `Key of ${str}`
        },
      }),
    )
    expect(words).toEqual(['标题'])
    expect(reslut.code).toMatchSnapshot()
  })

  it('transform', async () => {
    const words: string[] = []
    const reslut = transformJs(`
    let title = console.log('标题')
    `, genTransOptions(
      {
        add(str) {
          words.push(str)
        },
        getKey(str: string) {
          return `Key of ${str}`
        },
      }),
    )
    expect(words).toEqual(['标题'])
    expect(reslut.code).toMatchSnapshot()
  })
})
