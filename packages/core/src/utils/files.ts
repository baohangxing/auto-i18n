import fs from 'fs'
import path from 'path'

const writeFileSyncForce = (
  file: string,
  data: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions | undefined) => {
  if (!fs.existsSync(path.join(file, '..')))
    fs.mkdirSync(path.join(file, '..'), { recursive: true })
  fs.writeFileSync(file, data, options)
}

export { writeFileSyncForce }
