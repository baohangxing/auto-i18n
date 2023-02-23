import { describe, expect, it } from 'vitest'
import { getJsonPath } from '../../src'
// import serialize from 'serialize-javascript'
// import { CONFIG_FILE_NAME, defaultAutoBaseConfig, getAutoBaseConfig,   } from '../../src'
// import { playground } from '../_helps/playground'
// import { trimRootPath } from '../_helps/utils'
// import path from 'path'
// import fs from 'fs'

describe('#config', () => {
  // describe.skip('##getAutoBaseConfig', () => {
  //   playground(async () => {
  //     it('should get the default config', async () => {
  //       const filePath = path.join(process.cwd(), CONFIG_FILE_NAME)
  //       const config = defaultAutoBaseConfig
  //       const content = `module.exports = ${serialize(config, {
  //         unsafe: true,
  //       })}`

  //       fs.writeFileSync(filePath, content, 'utf8')
  //       const res = getAutoBaseConfig()
  //       expect(res).toMatchSnapshot()
  //     })
  //   })
  // })

  // playground(async () => {
  //   it('should get the default config by file path', async () => {
  //     const filePath = path.join(process.cwd(), CONFIG_FILE_NAME)
  //     const config = defaultAutoBaseConfig
  //     const content = `module.exports = ${serialize(config, {
  //         unsafe: true,
  //       })}`

  //     fs.writeFileSync(filePath, content, 'utf8')
  //     const res = getAutoBaseConfig(defaultAutoBaseConfig, filePath)
  //     expect(res).toMatchSnapshot()
  //   })
  // })

  describe('##getJsonPath', () => {
    it('should get none JSON paths', () => {
      const {
        baseLangJson,
        otherLangJsons,
      } = getJsonPath()
      expect(baseLangJson).toBe(undefined)
      expect(otherLangJsons).toEqual([])
    })
  })
})
