import path from 'path'
import fs from 'fs'
import { CONFIG_FILE_NAME } from '../../src/config/constants'

type PlaygroundFn = (content: { name: string; playgroundRoot: string;outputFileDir: string }) => Promise<void>

const getTestPlaygroundRootPath = (name: string) => {
  return path.resolve('test', '_helps', name)
}

const removeTestPlayground = (name: string) => {
  const pgPath = getTestPlaygroundRootPath(name)
  if (fs.existsSync(pgPath))
    fs.rmSync(pgPath, { force: true, recursive: true })
  const configPath = path.resolve(CONFIG_FILE_NAME)
  if (fs.existsSync(configPath))
    fs.rmSync(configPath)

  process.env._autoTestPlaygroundRuning = undefined
}

const createTestPlayground = (name: string) => {
  process.env._autoTestPlaygroundRuning = name

  const pgPath = getTestPlaygroundRootPath(name)

  const fromPath = path.resolve('test', '_helps', 'playground')
  if (fs.existsSync(pgPath))
    removeTestPlayground(name)

  fs.cpSync(fromPath, pgPath, { recursive: true })

  const configPath = path.join(pgPath, CONFIG_FILE_NAME)
  let config = fs.readFileSync(configPath).toString()
  config = config.replace('__testPlaygroundName__', name)
  fs.writeFileSync(configPath, config, 'utf8')
  fs.cpSync(configPath, path.resolve(CONFIG_FILE_NAME), { force: true })
}

const playground = (() => {
  const tasks: (() => Promise<void>)[] = []

  const runTask = async () => {
    if (tasks.length && !process.env._autoTestPlaygroundRuning) {
      const task = tasks.shift()
      task && await task()
      runTask()
    }
  }

  return async (play: PlaygroundFn) => {
    const task = async () => {
      const name = `playground_${+new Date()}`
      const pgPath = getTestPlaygroundRootPath(name)

      createTestPlayground(name)
      try {
        await play({
          name,
          playgroundRoot: pgPath,
          outputFileDir: path.join(pgPath, 'output'),
        })
      }
      catch (error) {
        removeTestPlayground(name)
        throw error
      }
      removeTestPlayground(name)
    }
    tasks.push(task)
    runTask()
  }
})()

export { playground }

export type { PlaygroundFn }
