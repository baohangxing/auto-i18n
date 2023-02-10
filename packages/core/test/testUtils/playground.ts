import path from 'path'
import fs from 'fs'
import { CONFIG_FILE_NAME } from '../../src/config/constants'

const getTestPlaygroundName = (name: string) => {
  return `testPlayground-${name}`
}

const getTestPlaygroundRootPath = (name: string) => {
  return path.resolve('test', getTestPlaygroundName(name))
}

const removeTestPlayground = (name: string) => {
  const pgPath = getTestPlaygroundRootPath(name)
  if (fs.existsSync(pgPath))
    fs.rmSync(pgPath, { force: true, recursive: true })
  const configPath = path.resolve(CONFIG_FILE_NAME)
  if (fs.existsSync(configPath))
    fs.rmSync(configPath)
}

const addTestPlayground = (name: string) => {
  const pgPath = getTestPlaygroundRootPath(name)
  const fromPath = path.resolve('test', 'testPlayground')
  if (fs.existsSync(pgPath))
    removeTestPlayground(name)

  fs.cpSync(fromPath, pgPath, { recursive: true })

  const configPath = path.join(pgPath, CONFIG_FILE_NAME)
  let config = fs.readFileSync(configPath).toString()
  config = config.replace('__testPlaygroundName__', getTestPlaygroundName(name))
  fs.writeFileSync(configPath, config, 'utf8')
  fs.cpSync(configPath, path.resolve(CONFIG_FILE_NAME), { force: true })
}

export { getTestPlaygroundRootPath, addTestPlayground, removeTestPlayground }
