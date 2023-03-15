import * as vscode from 'vscode'
import { EXTENSION_SCHEME } from './config/constants'
import { contentProvider } from './utils/diff'
import { commandItemList } from './commands'
import logger from './utils/logger'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(
    EXTENSION_SCHEME,
    contentProvider,
  ))

  commandItemList.forEach((x) => {
    const registerCommand = x.type === 'TEXT_EDITOR'
      ? vscode.commands.registerTextEditorCommand
      : vscode.commands.registerCommand

    const disposable = registerCommand(x.name,
      async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        x.command.execute(textEditor, edit).catch((e: Error) => {
          logger.error(`${e.name}: ${e.message} ${e.stack}`)
        })
      })

    context.subscriptions.push(disposable)
  })
}

export function deactivate() {}
