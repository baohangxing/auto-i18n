import * as vscode from 'vscode'
import {
  defaultAutoBaseConfig,
  getAutoBaseConfig,
  getJsonPath,
} from '@yostar/auto-i18n-core'

const getDocumentWorkspaceFolder = (): string | undefined => {
  const fileName = vscode.window.activeTextEditor?.document.fileName
  return vscode.workspace.workspaceFolders
    ?.map(folder => folder.uri.fsPath)
    .filter(fsPath => fileName?.startsWith(fsPath))[0]
}

const getJsonPathBindWorkspace = getJsonPath.bind(null, defaultAutoBaseConfig, getDocumentWorkspaceFolder())

const getAutoBaseConfigBindWorkspace = getAutoBaseConfig.bind(
  null, defaultAutoBaseConfig, getDocumentWorkspaceFolder())

export { getDocumentWorkspaceFolder, getJsonPathBindWorkspace, getAutoBaseConfigBindWorkspace }
