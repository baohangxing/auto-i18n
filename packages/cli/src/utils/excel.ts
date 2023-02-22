import fs from 'fs'
import type { WorkSheet } from 'node-xlsx'
import xlsx from 'node-xlsx'

const writeXlsxFile = (
  firstRows: string[][],
  sheetNameArr: string[],
  sheetsDatas: string[][][],
  fileWritePath: fs.PathOrFileDescriptor,
) => {
  const data: WorkSheet<string>[] = []

  for (let i = 0; i < sheetNameArr.length; i++) {
    data.push({
      name: sheetNameArr[i],
      data: [firstRows[i], ...sheetsDatas[i]],
      options: {},
    })
  }

  const buffer = xlsx.build(data)

  fs.writeFileSync(fileWritePath, buffer)
}

const readXlsxFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    const obj = xlsx.parse(filePath)
    return obj
  }
  else {
    throw new Error(`Don't exist ${filePath}`)
  }
}

export { writeXlsxFile, readXlsxFile }
