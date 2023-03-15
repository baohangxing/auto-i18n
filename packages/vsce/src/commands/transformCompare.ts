import * as path from 'path'
import * as vscode from 'vscode'
import type { FileExtension } from '@yostar/auto-i18n-core'
import { KeyCollector, lintText } from '@yostar/auto-i18n-core'
import * as fsExtra from 'fs-extra'
import { diffCommand } from '../utils/diff'
import { transform } from '../utils/tramsform'
import { getDocumentWorkspaceFolder, getJsonPathBindWorkspace } from '../utils/tools'
import logger from '../utils/logger'
import type { Command } from '.'

const transformCompareCommand: Command = {
  execute: async (textEditor: vscode.TextEditor) => {
    const document = textEditor.document
    if (document) {
      await vscode.window.showInputBox({
        placeHolder: '请输入中文对应的 key (JSON)',
      }).then(async (res) => {
        const { baseLangJson } = getJsonPathBindWorkspace()
        if (!baseLangJson?.path)
          throw new Error('No baseLangJson')

        const baseLangJsonObj = fsExtra.readJsonSync(baseLangJson.path)

        const collector = new KeyCollector(baseLangJsonObj, logger)
        collector.init(JSON.parse(!res ? '{}' : res))
        const text = document.getText()
        const { name, dir } = path.parse(document.fileName)
        const ext = path.parse(document.fileName).ext.slice(1) as FileExtension
        const textTransformed = transform(text, ext, collector).code

        const filePath = path.join(dir, `${name}_eslint_${Math.random().toString().slice(6)}.${ext}`)

        const textLinted = await lintText(textTransformed, getDocumentWorkspaceFolder(), {
          filePath,
        })
        diffCommand(text, textLinted)
      })
    }
  },
}

export default transformCompareCommand
