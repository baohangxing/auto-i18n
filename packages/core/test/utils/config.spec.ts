import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import serialize from 'serialize-javascript'
import type { LangJson } from '../../src'
import { CONFIG_FILE_NAME, defaultAutoBaseConfig, getAutoBaseConfig, getJsonPath } from '../../src'
import { playground } from '../_helps/playground'
import { trimRootPath } from '../_helps/utils'

const filePath = path.join(process.cwd(), CONFIG_FILE_NAME)

describe('#config', () => {
  describe('getAutoBaseConfig', () => {
    it('should get default config', async () => {
      let res
      await playground(async () => {
        const config = defaultAutoBaseConfig
        const content = `module.exports = ${serialize(config, {
          unsafe: true,
        })}`

        fs.writeFileSync(filePath, content, 'utf8')
        res = getAutoBaseConfig()
      })
      expect(res).toMatchSnapshot()
    })

    it('should get default config by file path', async () => {
      await playground(async () => {
        expect(getAutoBaseConfig(defaultAutoBaseConfig, filePath)).toMatchSnapshot()
      })
    })
  })

  describe('getJsonPath', () => {
    it('should get none JSON paths', async () => {
      let baseLangJsonRes, otherLangJsonsRes

      await playground(async () => {
        const {
          baseLangJson,
          otherLangJsons,
        } = getJsonPath()
        baseLangJsonRes = baseLangJson
        otherLangJsonsRes = otherLangJsons
        console.log(111, otherLangJsons)
      })
      expect(baseLangJsonRes).toBe(undefined)
      expect(otherLangJsonsRes).toEqual([])
    })

    it('should get JSON paths', async () => {
      let baseLangJsonRes: LangJson | undefined
      let otherLangJsonsRes: LangJson[] = []

      let nameRes = ''
      await playground(async ({ name }) => {
        const {
          baseLangJson,
          otherLangJsons,
        } = getJsonPath()
        baseLangJsonRes = baseLangJson
        otherLangJsonsRes = otherLangJsons
        nameRes = name
      })
      expect(baseLangJsonRes).not.toBe(undefined)
      expect(trimRootPath([baseLangJsonRes?.path?.replace(nameRes, '__name') ?? ''])).toMatchSnapshot()
      expect(trimRootPath(otherLangJsonsRes.map(x => x.path.replace(nameRes, '__name')))).toMatchSnapshot()
    })
  })
})

afterAll(async () => {
  if (fs.existsSync(filePath))
    fs.rmSync(filePath)
})
