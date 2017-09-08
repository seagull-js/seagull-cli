import { Command, command, param } from 'clime'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'

@command({ description: 'create a new seagull app' })
export default class extends Command {
  execute(
    @param({ description: 'name of the app', required: true })
    name: string
  ) {
    log('scaffolding new seagull app...')
    const dest = copyTemplateFolder(name)
    if (process.env.NODE_ENV === 'test') {
      log('skipping dependencies...')
    } else {
      log('installing dependencies...')
      setupDependencies(dest)
    }
    log(`created app in: ${dest}`)
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}

function copyTemplateFolder(name: string): string {
  const pwd = shell.pwd().toString()
  const dest = join(pwd, name)
  const src = join(__dirname, '..', '..', 'templates', 'app')
  shell.cp('-R', src, dest)
  const files = dir.files(dest, { sync: true })

  shell.sed('-i', 'APP_NAME', name, files)
  return dest
}

function setupDependencies(dest: string) {
  shell.cd(dest)
  shell.exec('npm install', { silent: true })
}
