import fs from 'fs'
import path from 'path'
import consola from 'consola'
import fg from 'fast-glob'
import type { AutoCongfig } from '../types'

const configName = 'auto.config.ts'

const readAutoConfig = (): AutoCongfig => {
  const configFilePath = path.join(process.cwd(), configName)
  if (!fs.existsSync(configFilePath)) {
    consola.error(`pleace add ${configName} file in your project(${process.cwd()}) and export default AutoCongfig`)
    process.exit(1)
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(configFilePath)?.default
}

const getAutoConfig = (() => {
  let autoCongfig: AutoCongfig
  return () => {
    if (autoCongfig) {
      return autoCongfig
    }
    else {
      autoCongfig = readAutoConfig()
      return autoCongfig
    }
  }
})()

const getConfig = (async () => {
  const autoCongfig = getAutoConfig()
  const allJsonPaths = await fg(autoCongfig.localesJsonPath, { dot: true })
  console.log(autoCongfig.localesJsonPath, allJsonPaths)
  return {
    allJsonPaths,
    processPath: process.cwd(),
  }
})()

export { getAutoConfig, getConfig }
