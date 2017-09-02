import { Command, command, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'

@command({ description: 'scaffold a new api handler' })
export default class extends Command {
  execute(
    @param({ description: 'name of the api handler', required: true })
    name: string,
    @param({ description: 'url path for the handler', required: false })
    path: string
  ) {
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'api', `${name}.ts`)
    const src = join(
      __dirname,
      '..',
      '..',
      '..',
      'templates',
      'api',
      'handler.ts'
    )
    shell.mkdir('-p', 'api')
    shell.cp(src, dest)
    shell.sed('-i', 'APINAME', name, dest)
    if (path) {
      shell.sed('-i', "// static path = '/'", `static path = '${path}'`, dest)
    }
    log(`created api in: ${dest}`)
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
