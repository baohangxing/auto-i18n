import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import log from '../../src/utils/log'
import { sleep } from '../_helps/utils'

describe('#Log', () => {
  it('info should be call success', () => {
    expect(log.info('info')).toBeUndefined()
  })
  it('error should be call success', () => {
    expect(log.error('info', 'more info')).toBeUndefined()
  })
  it('success should be call success', () => {
    expect(log.success('info')).toBeUndefined()
  })
  it('warning be call success', () => {
    expect(log.warning('info')).toBeUndefined()
  })
  it('verbose should be call success', () => {
    expect(log.verbose('info', 'more info')).toBeUndefined()
  })
  // TODO can't display in terminal
  it('debug should be call success', async () => {
    const bar = log.newProgressBar(100)
    expect(bar.start('start info')).toBeUndefined()
    expect(bar.update(0)).toBeUndefined()
    for (let i = 1; i <= 100; i++) {
      await sleep(10, '')
      bar.update(i, `start info ${i}`)
    }
    expect(bar.stop()).toBeUndefined()
  })
})

const originVerboseData = process.env.AUTO_I18N_VERBOSE

beforeAll(() => {
  process.env.AUTO_I18N_VERBOSE = 'true'
})

afterAll(() => {
  process.env.AUTO_I18N_VERBOSE = originVerboseData
})
