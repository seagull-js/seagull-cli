import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a new data model' })
export default class extends Command {
  execute(
    @param({ description: 'name of the data model', required: true })
    name: string
  ) {
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'models', `${name}.ts`)
    const src = join(
      __dirname,
      '..',
      '..',
      '..',
      'templates',
      'model',
      'model.ts'
    )
    shell.mkdir('-p', 'models')
    shell.cp(src, dest)
    shell.sed('-i', 'MODELNAME', name, dest)
    log(`created model in: ${dest}`)
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
