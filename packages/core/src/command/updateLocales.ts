import { getKeys, getValueByKey, setValueByKey, sortObjectKey, writeToJsonFile } from '../utils/help'

interface Task {
  json: any
  fileName: string
  UniKey: string
}

const updateLocales = async () => {
  const tasks: Task[] = []
  for (const task of tasks) {
    const typeJsonKeySet = new Set(getKeys({}))
    const langJsonKeySet = new Set(getKeys(task.json))
    const newObj = sortObjectKey({ })
    for (const x of typeJsonKeySet) {
      const typeValue = getValueByKey({}, x)
      const langValue = getValueByKey(task.json, x)

      if (typeof langValue === 'string') {
        setValueByKey(
          newObj,
          x,
          langValue.includes(task.UniKey) ? task.UniKey + typeValue : langValue,
        )
      }
      else {
        setValueByKey(newObj, x, task.UniKey + typeValue)
      }
      langJsonKeySet.delete(x)
    }
    if (langJsonKeySet.size > 0) {
      for (const x of langJsonKeySet) {
        console.log(
            `${x} : ${getValueByKey(task.json, x)} in ${
              task.fileName
            }.json is deleted`,
        )
        console.error(`pleace check ${x} is used in project!!!`)
      }
    }

    await writeToJsonFile('', task.fileName, newObj)
  }
}

export { updateLocales }
