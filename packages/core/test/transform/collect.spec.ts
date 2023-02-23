import { describe, expect, it } from 'vitest'
import { KeyCollector, getPinyin } from '../../src'

describe('#collector', () => {
  describe('#getPinyin', () => {
    it('should get Pinyin of chinese', () => {
      expect(getPinyin('你好')).toEqual('nihao')
      expect(getPinyin('中国馆')).toEqual('zhongguoguan')
      expect(getPinyin('你好!!!')).toEqual('nihao!!!')
    })

    it('should get Pinyin of string', () => {
      expect(getPinyin(' !!!')).toEqual('!!!')
      expect(getPinyin('hi')).toEqual('hi')
    })

    it('should get Pinyin of empty', () => {
      expect(getPinyin('  \n')).toEqual('')
      expect(getPinyin('  ')).toEqual('')
    })
  })

  describe('#KeyCollector', () => {
    const obj = { title: '标题', deep: { key: 'value' } }
    const keyCollector = new KeyCollector(obj)
    keyCollector.init()

    it('keyCollector can init', () => {
      expect(keyCollector.inited).toEqual(true)

      it('should get right keyZhMap', () => {
        expect(keyCollector.keyZhMap).toEqual({
          'deep.key': 'value',
          'title': '标题',
        })
      })
    })

    it('should get right key', () => {
      expect(keyCollector.getKey('标题')).toEqual('title')
    })
  })

  describe('#KeyCollector', () => {
    const obj = { title: '标题', deep: { key: 'value' } }

    const keyCollector = new KeyCollector({})
    keyCollector.init(obj)

    it('keyCollector can init', () => {
      expect(keyCollector.inited).toEqual(true)
    })

    it('should get right keyZhMap', () => {
      expect(keyCollector.keyZhMap).toEqual({
        'deep.key': 'value',
        'title': '标题',
      })
    })

    it('should get right key', () => {
      expect(keyCollector.getKey('value')).toEqual('deep.key')
    })

    it('should add right key', () => {
      keyCollector.add('你好')
      expect(keyCollector.getKey('你好')).toEqual('nihao')
      expect(keyCollector.getKey('你好')).toEqual('nihao')
    })

    it('should add right key with same Pinyin', () => {
      keyCollector.add('一哥')
      keyCollector.add('艺阁')
      expect(keyCollector.getKey('一哥')).toEqual('yige')
      expect(keyCollector.getKey('艺阁')).toEqual('yige-1')
    })
  })
})
