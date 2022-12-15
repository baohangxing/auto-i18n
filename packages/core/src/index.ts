import { Command } from 'commander'
import { version } from '../package.json'
import { trans } from './command/trans'
import type { TransCommandOption } from './types/trans'

const program = new Command()

program
  .name('auto')
  .description('CLI to help you auto trans your vue project to an i18n-project')
  .version(version)

program.command('trans')
  .description('trans a single file')
  .argument('<string>', 'file path')
  .option('--gen', 'generate a new file')
  .option('-n, --name <string>', 'new file name', '')
  .action((filePath, options) => {
    console.log(filePath, options)
    const transCommandOption: TransCommandOption = {
      filePath,
      generateNewFile: !!options.gen,
      newFileName: options.name ?? '',
    }
    trans(transCommandOption)
  })

program.parse()
