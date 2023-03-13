import { describe, expect, it } from 'vitest'
import type { AutoBaseConfig, Collector } from '../../src/types'
import { initJsParse } from '../../src/transform'
import type { TransformJsOptions } from '../../src/transform/transformJs'
import transformJs from '../../src/transform/transformJs'
import { defaultAutoBaseConfig } from '../../src'

const genTransOptions = (collector: Collector, autoConfig?: Partial<AutoBaseConfig>): TransformJsOptions => {
  return {
    rule: {
      transCaller: '',
      transIdentifier: 't',
      variableDeclaration: 'const t = useI18n()',
      importDeclaration: 'import { useI18n } from \'vue-i18n\'',
    },
    parse: initJsParse(),
    autoConfig: Object.assign({}, defaultAutoBaseConfig, autoConfig),
    replace: true,
    collector,
  }
}

describe('#transform', () => {
  it('should transform basic code', async () => {
    const words: string[] = []
    const reslut = transformJs(`
    import { ref } from \'vue\'
    let title = ref("标题")
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

  it('should transform code when import', async () => {
    const words: string[] = []
    const reslut = transformJs(`
    import { useI18n } from \'vue-i18n\'
    const t = useI18n()
    
    let x = t('s')
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

  it('should transform code in function', async () => {
    const words: string[] = []
    const reslut = transformJs(`
    import fs from 'fs'
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

  it('should transform code in template', async () => {
    const words: string[] = []
    const reslut = transformJs(

      `const title = \`标题\$\{msg\}\`
      const title1 = \`标题1\$\{1221\}标题1\$\{12121\}\`
      const title2 = \`标题2\$\{title + title1\}\`
      const title3 = \`\${msg}标题3\$\{msg\}\`
      `
      , genTransOptions(
        {
          add(str) {
            words.push(str)
          },
          getKey(str: string) {
            return `Key of ${str}`
          },
        }),
    )
    expect(words).toEqual(['标题{msg}',
      '标题1{slot1}标题1{slot2}',
      '标题2{slot1}',
      '{msg}标题3{msg}'])
    expect(reslut.code).toMatchSnapshot()
  })

  it('should transform code in template when transInterpolationsMode is ListInterpolationMode', async () => {
    const words: string[] = []
    const reslut = transformJs(
      `const title = \`标题\$\{msg\}\`
      const title1 = \`标题1\$\{1221\}标题1\$\{12121\}\`
      const title2 = \`标题2\$\{title + title1\}\`
      const title3 = \`\${msg}标题3\$\{msg\}\`
      `
      , genTransOptions(
        {
          add(str) {
            words.push(str)
          },
          getKey(str: string) {
            return `Key of ${str}`
          },
        }, {
          transInterpolationsMode: 'ListInterpolationMode',
        }),
    )
    expect(words).toEqual(['标题{0}',
      '标题1{0}标题1{1}',
      '标题2{0}',
      '{0}标题3{1}'])
    expect(reslut.code).toMatchSnapshot()
  })

  it('should transform code', async () => {
    const words: string[] = []
    const reslut = transformJs(
      // eslint-disable-next-line no-template-curly-in-string
      'const title = `标题\$\{msg\}`'
      , genTransOptions(
        {
          add(str) {
            words.push(str)
          },
          getKey(str: string) {
            return `Key of ${str}`
          },
        }, {
          transInterpolationsMode: 'ListInterpolationMode',
        }),
    )
    expect(words).toEqual(['标题{0}'])
    expect(reslut.code).toMatchSnapshot()
  })

  it('should transform jsx code', async () => {
    const words: string[] = []
    const reslut = transformJs(
      'const title = (<div>不好不好{aa}</div>)'
      , genTransOptions(
        {
          add(str) {
            words.push(str)
          },
          getKey(str: string) {
            return `Key of ${str}`
          },
        }, {
          transInterpolationsMode: 'ListInterpolationMode',
        }),
    )
    expect(words).toEqual(['不好不好'])
    expect(reslut.code).toMatchSnapshot()
  })

  it('should don\'t transform code if ignored', async () => {
    const words: string[] = []
    transformJs(
      `//auto-i18n-ignore
      let title = "标题" 
      `
      , genTransOptions(
        {
          add(str) {
            words.push(str)
          },
          getKey(str: string) {
            return `Key of ${str}`
          },
        }, {
          transInterpolationsMode: 'ListInterpolationMode',
        }),
    )
    expect(words).toEqual([])
  })
})
