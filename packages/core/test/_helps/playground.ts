import path from 'path'
import fs from 'fs'
import { CONFIG_FILE_NAME } from '../../src/config/constants'

interface PlaygroundContent {
  name: string
  playgroundRoot: string
  outputFileDir: string
}

type PlaygroundFn = (content: PlaygroundContent) => Promise<void>

interface Task {
  name: string
  fn: () => Promise<void>
  cb: () => void
}

const getTestPlaygroundRootPath = (name: string) => {
  return path.resolve('test', '_helps', name)
}

const removeTestPlayground = (name: string) => {
  const pgPath = getTestPlaygroundRootPath(name)
  if (fs.existsSync(pgPath)) {
    fs.rmSync(pgPath, { force: true, recursive: true })
    const configPath = path.resolve(CONFIG_FILE_NAME)
    if (fs.existsSync(configPath))
      fs.rmSync(configPath)
  }
}

const createTestPlayground = (name: string) => {
  const pgPath = getTestPlaygroundRootPath(name)

  const fromPath = path.resolve('test', '_helps', 'playground')
  if (fs.existsSync(pgPath))
    removeTestPlayground(name)

  fs.cpSync(fromPath, pgPath, { recursive: true })

  const configPath = path.join(pgPath, CONFIG_FILE_NAME)
  let config = fs.readFileSync(configPath, 'utf-8')
  config = config.replace('__testPlaygroundName__', name)
  fs.writeFileSync(configPath, config, 'utf-8')
  fs.cpSync(configPath, path.resolve(CONFIG_FILE_NAME), { force: true })
}

/**
 *  //TODO need fix threads problem
 */
const playground = (() => {
  const tasks: Task[] = []

  let _autoTestPlaygroundRuning = false

  const _runTask = async () => {
    if (tasks.length) {
      if (!_autoTestPlaygroundRuning) {
        const task = tasks.shift()
        if (task) {
          _autoTestPlaygroundRuning = true
          await task.fn().finally(() => {
            task.cb()
            _autoTestPlaygroundRuning = false
            _runTask()
          })
        }
      }
    }
  }

  const addTask = (task: Task) => {
    tasks.push(task)
    if (!_autoTestPlaygroundRuning)
      _runTask()
  }

  return (play: PlaygroundFn) => {
    const name = `playground_${+new Date()}_${Math.random().toString().slice(10)}`

    /** for resolve task */
    return new Promise((resolve) => {
      addTask({
        fn: async () => {
          const pgPath = getTestPlaygroundRootPath(name)
          createTestPlayground(name)
          /** for resolve play of  task */
          return new Promise((_resolve) => {
            play({
              name,
              playgroundRoot: pgPath,
              outputFileDir: path.join(pgPath, 'output'),
            }).then(async () => {
              removeTestPlayground(name)
              return _resolve(undefined)
            }).catch(async (error) => {
              removeTestPlayground(name)
              throw error
            })
          })
        },
        cb: () => {
          resolve(undefined)
        },
        name,
      })
    })
  }
})()

export { playground }

export type { PlaygroundFn }
