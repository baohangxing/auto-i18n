import * as vscode from 'vscode'
import { EXTENSION_SCHEME } from './config/constants'
import { contentProvider } from './utils/diff'
import { commandItemList } from './commands'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(
    EXTENSION_SCHEME,
    contentProvider,
  ))

  commandItemList.forEach((x) => {
    const registerCommand = x.type === 'TEXT_EDITOR'
      ? vscode.commands.registerTextEditorCommand
      : vscode.commands.registerCommand

    const disposable = registerCommand(x.name, x.command.execute)

    context.subscriptions.push(disposable)
  })
}

export function deactivate() {}
