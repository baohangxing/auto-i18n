import * as path from 'path'
import type * as vscode from 'vscode'
import type { FileExtension } from '@h1mple/auto-i18n-core'
import { lintText } from '@h1mple/auto-i18n-core'
import { diffCommand } from '../utils/diff'
import { transform } from '../utils/tramsform'
import { getDocumentWorkspaceFolder } from '../utils/tools'
import type { Command } from '.'

const transformCompareCommand: Command = {
  execute: async (textEditor: vscode.TextEditor) => {
    const document = textEditor.document
    if (document) {
      const text = document.getText()
      const { name, dir } = path.parse(document.fileName)
      const ext = path.parse(document.fileName).ext.slice(1) as FileExtension
      const textTransformed = transform(text, ext).code

      const filePath = path.join(dir, `${name}_eslint_${Math.random().toString().slice(6)}.${ext}`)

      const textLinted = await lintText(textTransformed, getDocumentWorkspaceFolder(), {
        filePath,
      })
      diffCommand(text, textLinted)
    }
  },
}

export default transformCompareCommand
