import * as vscode from 'vscode'
import type { Command } from '.'

const transformCompareCommand: Command = {
  execute: () => {
    vscode.window.showInformationMessage('开发中')
  },
}

export default transformCompareCommand
