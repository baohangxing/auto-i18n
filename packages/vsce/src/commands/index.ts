import type * as vscode from 'vscode'
import { PROJECT_NAME } from '../config/constants'
import transformCompareCommand from './transformCompare'
import getTransformKey from './getTransformKey'
import transformCommand from './transform'

export type CommandType = 'TEXT_EDITOR' | 'GENERAL'

export interface Command {
  execute(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Promise<any>
}

export interface CommandItem {
  name: string
  type: CommandType
  command: Command
}

const commandItemList: CommandItem[] = [
  {
    name: `${PROJECT_NAME}.getTransformKey`,
    type: 'TEXT_EDITOR',
    command: getTransformKey,
  },
  {
    name: `${PROJECT_NAME}.transformCompare`,
    type: 'TEXT_EDITOR',
    command: transformCompareCommand,
  },
  {
    name: `${PROJECT_NAME}.transform`,
    type: 'TEXT_EDITOR',
    command: transformCommand,
  },
]

export { commandItemList }
