import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { generatePage } from '../../lib/codegen'
import { log } from '../../lib/logger'

export class SomeOptions extends Options {
  @option({
    description: 'url path for the web page',
    flag: 'p',
    name: 'path',
    placeholder: '/my-handler',
    required: true,
  })
  path: string
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a new web page' })
export default class extends Command {
  execute(
    @param({ description: 'name of the web page', required: true })
    name: string,
    options: SomeOptions
  ) {
    const gen = generatePage(name, options)
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'frontend', 'pages', `${name}.tsx`)
    gen.toFile(dest)
    log(`created web page in: ${dest}`)
  }
}
