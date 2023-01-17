import log from '../utils/log'

class Collector {
  static keyMap: Record<string, string> = {}

  private constructor() {}

  static add(key: string) {
    log.verbose('Extract Chinese: ', key)
    Collector.keyMap[key] = key
  }
}

export default Collector
