import * as path from 'path'
import * as vscode from 'vscode'
import type { FileExtension } from '@yostar/auto-i18n-core'
import { KeyCollector, sortObjectKey } from '@yostar/auto-i18n-core'
import * as fsExtra from 'fs-extra'
import { transform } from '../utils/tramsform'
import { contentProvider, makeUriString } from '../utils/diff'
import { getJsonPathBindWorkspace } from '../utils/tools'
import logger from '../utils/logger'
import type { Command } from '.'

const getTransformKeyCommand: Command = {
  execute: async (textEditor: vscode.TextEditor) => {
    const document = textEditor.document
    if (document) {
      const text = document.getText()
      const { name } = path.parse(document.fileName)
      const ext = path.parse(document.fileName).ext.slice(1) as FileExtension

      const { baseLangJson } = getJsonPathBindWorkspace()
      if (!baseLangJson?.path)
        throw new Error('No baseLangJson')

      const baseLangJsonObj = fsExtra.readJsonSync(baseLangJson.path)

      const collector = new KeyCollector(baseLangJsonObj, logger)
      collector.init()

      transform(text, ext, collector, false)

      const obj: any = {}
      for (const x of collector.unExistZhSet)
        obj[collector.getKey(x)] = x

      const url = makeUriString(`${name} 提取 key 预览`)

      contentProvider.set(url, JSON.stringify(sortObjectKey(obj), undefined, 2))

      vscode.window.showTextDocument(vscode.Uri.parse(url))
    }
  },
}

export default getTransformKeyCommand
