import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a new frontend page' })
export default class extends Command {
  execute(
    @param({ description: 'name of the frontend page', required: true })
    name: string
  ) {
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'frontend', 'pages', `${name}.tsx`)
    const src = join(
      __dirname,
      '..',
      '..',
      '..',
      'templates',
      'page',
      'Page.tsx'
    )
    shell.mkdir('-p', 'frontend/pages')
    shell.cp(src, dest)
    shell.sed('-i', 'NAME', name, dest)
    log(`created frontend page in: ${dest}`)
    log(`remember to add the page to routes.tsx`)
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
