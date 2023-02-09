import fs from 'fs'
import type { WorkSheet } from 'node-xlsx'
import xlsx from 'node-xlsx'
import log from './log'

const writeXlsxFile = (
  firstRows: string[][],
  sheetNameArr: string[],
  sheetsDatas: string[][][],
  fileWritePath: string,
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

  try {
    fs.writeFileSync(fileWritePath, buffer)
    log.info(`Write to xls has finished: ${fileWritePath}`)
  }
  catch (error) {
    log.error('writeXlsxFile error', error)
  }
}

const readXlsxFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    const obj = xlsx.parse(filePath)
    return obj as {
      name: string
      data: string[][]
    }[]
  }
  else {
    log.error(`not exists ${filePath}`)
  }
}

export { writeXlsxFile, readXlsxFile }
