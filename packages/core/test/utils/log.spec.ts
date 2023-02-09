import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import log from '../../src/utils/log'

describe('#log', () => {
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
  it('debug should be call success', () => {
    expect(log.debug('info', 'more info')).toBeUndefined()
  })
})

const originDebugData = process.env.AUTO_I18N_DEBUG
const originVerboseData = process.env.AUTO_I18N_VERBOSE

beforeAll(() => {
  process.env.AUTO_I18N_VERBOSE = 'true'
  process.env.AUTO_I18N_DEBUG = 'true'
})

afterAll(() => {
  process.env.AUTO_I18N_VERBOSE = originVerboseData
  process.env.AUTO_I18N_DEBUG = originDebugData
})
