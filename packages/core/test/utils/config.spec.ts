import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import serialize from 'serialize-javascript'
import {
  CONFIG_FILE_NAME,
  defaultAutoBaseConfig,
  getAutoBaseConfig,
  getJsonPath,
  revertWordByKey,
} from '../../src'
import { playground } from '../_helps/playground'

describe('#config', () => {
  describe('##getAutoBaseConfig', () => {
    playground(async () => {
      const filePath = path.join(process.cwd(), CONFIG_FILE_NAME)
      const config = defaultAutoBaseConfig
      const content = `module.exports = ${serialize(config, {
          unsafe: true,
        })}`

      fs.writeFileSync(filePath, content, 'utf8')

      it('should get the default config', () => {
        const res = getAutoBaseConfig()
        expect(res).toMatchSnapshot()
      })
    })
  })

  describe('##getAutoBaseConfig', () => {
    playground(async () => {
      const filePath = path.join(process.cwd(), CONFIG_FILE_NAME)
      const config = defaultAutoBaseConfig
      const content = `module.exports = ${serialize(config, {
          unsafe: true,
        })}`

      fs.writeFileSync(filePath, content, 'utf8')

      it('should get the default config by file path', () => {
        const res = getAutoBaseConfig(defaultAutoBaseConfig, filePath)
        expect(res).toMatchSnapshot()
      })
    })
  })

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

  describe('##getJsonPath', () => {
    playground(async () => {
      const {
        baseLangJson,
        otherLangJsons,
      } = getJsonPath()
      it('should get JSON paths', () => {
        expect(baseLangJson).not.toBe(undefined)
        expect(baseLangJson?.name).toBe('cn')
        expect(otherLangJsons.length).toBe(1)
        expect(otherLangJsons?.[0].name).toBe('en')
      })
    })
  })

  describe('##revertWordByKey', () => {
    playground(async () => {
      const getJpWord = revertWordByKey('jp')
      const getCnWord = revertWordByKey('cn')
      const getEnWord = revertWordByKey('en')
      it('should get words if no match locale JSON', () => {
        expect(getJpWord('dazigao')).toBe('打字稿')
        expect(getJpWord('hi')).toBe('hi')
      })

      it('should get words in en', () => {
        expect(getEnWord('dazigao')).toBe('typescript')
        expect(getEnWord('hi')).toBe('hi')
      })

      it('should get words in cn', () => {
        expect(getCnWord('dazigao')).toBe('打字稿')
        expect(getCnWord('hi')).toBe('hi')
      })
    })
  })

  describe('##revertWordByKey', () => {
    const getWord = revertWordByKey('cn')
    it('should no get words if no locale JSON', () => {
      expect(getWord('dazigao')).toBe('dazigao')
      expect(getWord('hi')).toBe('hi')
    })
  })
})
