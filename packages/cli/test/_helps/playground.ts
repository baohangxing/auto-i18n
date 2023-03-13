import path from 'path'
import fs, { existsSync, rmSync, writeFileSync } from 'fs'
import fsExtra from 'fs-extra'
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
  if (fs.existsSync(pgPath))
    fs.rmSync(pgPath, { force: true, recursive: true })

  const configPath = path.resolve(CONFIG_FILE_NAME)
  if (fs.existsSync(configPath))
    fs.rmSync(configPath, { force: true, recursive: true })
}

const createTestPlayground = (name: string) => {
  const pgPath = getTestPlaygroundRootPath(name)

  const fromPath = path.resolve('test', '_helps', 'playground')
  if (fs.existsSync(pgPath))
    removeTestPlayground(name)

  fsExtra.copySync(fromPath, pgPath, { recursive: true })

  const configPath = path.join(pgPath, CONFIG_FILE_NAME)
  let config = fs.readFileSync(configPath, 'utf-8')
  config = config.replace('__testPlaygroundName__', name)
  fs.writeFileSync(configPath, config, 'utf-8')
  fsExtra.copySync(configPath, path.resolve(CONFIG_FILE_NAME), { overwrite: true })
}

const playground = (() => {
  const tasks: Task[] = []

  const _runName = '._playgroundRuning'
  const _runNameFilePath = path.resolve(process.cwd(), _runName)

  const _getAutoTestPlaygroundRuning = () => {
    return existsSync(_runNameFilePath)
  }

  const _setAutoTestPlaygroundRuning = (status: boolean) => {
    if (status)
      !_getAutoTestPlaygroundRuning() && writeFileSync(path.resolve(process.cwd(), _runName), '1', 'utf-8')
    else
      _getAutoTestPlaygroundRuning() && rmSync(path.resolve(process.cwd(), _runName))
  }

  const _runTask = async () => {
    if (tasks.length) {
      if (!_getAutoTestPlaygroundRuning()) {
        const task = tasks.shift()
        if (task) {
          _setAutoTestPlaygroundRuning(true)
          console.log(task.name, 'Runing')
          await task.fn().finally(() => {
            task.cb()
            console.log(task.name, 'Runing End')
            _setAutoTestPlaygroundRuning (false)
            _runTask()
          })
        }
      }
      else {
        setTimeout(() => {
          _runTask()
        }, 500)
      }
    }
  }

  const addTask = (task: Task) => {
    console.log(tasks.length, 'tasks Runing, ', 'add', task.name)
    tasks.push(task)
    if (!_getAutoTestPlaygroundRuning())
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
          /** for resolve play of task */
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
