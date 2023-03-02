import * as vscode from 'vscode'
import type { TextDocumentContentProvider } from 'vscode'
import { EXTENSION_SCHEME } from '../config/constants'

export const extractTextKey = (uri: vscode.Uri): string =>
  uri.path.match(/^text\/([a-z\d]+)/)?.[1] ?? ''

const makeUriString = (): string =>
    `${EXTENSION_SCHEME}:text/${Math.random().toString().slice(4)}`

class ContentProvider implements TextDocumentContentProvider {
  private readonly data: [string, string][]

  constructor() {
    this.data = []
  }

  set(key: string, text: string): void {
    this.data.unshift([key.match(/text\/([a-z\d]+)/)?.[1] ?? '', text])
    if (this.data.length > 10)
      this.data.pop()
  }

  provideTextDocumentContent(uri: vscode.Uri): string {
    const textKey = extractTextKey(uri)
    for (const [key, res] of this.data) {
      if (key === textKey)
        return res
    }
    return ''
  }
}

const contentProvider = new ContentProvider()

const diffCommand = (source: string, compare: string, title = '源文件 <-> 转换后') => {
  const sourceUrl = makeUriString()
  const compareUrl = makeUriString()

  contentProvider.set(sourceUrl, source)
  contentProvider.set(compareUrl, compare)

  vscode.commands.executeCommand('vscode.diff'
    , vscode.Uri.parse(sourceUrl)
    , vscode.Uri.parse(compareUrl)
    , title)
}

export { contentProvider, diffCommand }
