import { generateComponentTsx } from '@seagull/code-generators'
import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { log } from '../../lib/logger'

export class SomeOptions extends Options {
  @option({
    description: 'stateful class component instead of a stateless function',
    flag: 'c',
    name: 'class',
    required: false,
  })
  class?: boolean
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a new frontend component' })
export default class extends Command {
  execute(
    @param({ description: 'name of the component', required: true })
    name: string,
    options?: SomeOptions
  ) {
    const classic = options && options.class
    const gen = generateComponentTsx(name, classic)
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'frontend', 'components', `${name}.tsx`)
    shell.mkdir('-p', join(pwd, 'frontend', 'components'))
    gen.toFile(dest)
    log(`created frontend component in: ${dest}`)
  }
}
