import { Command, command, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'

@command({ description: 'create a new seagull app' })
export default class extends Command {
  public execute(
    @param({ description: 'name of the app', required: true })
    name: string
  ) {
    // tslint:disable-next-line:no-console
    console.log('scaffolding new seagull app...')
    const dest = copyTemplateFolder(name)

    // tslint:disable-next-line:no-console
    console.log('installing dependencies...')
    setupDependencies(dest)

    // tslint:disable-next-line:no-console
    console.log('created app in: ', dest)
  }
}

function copyTemplateFolder(name: string): string {
  const pwd = shell.pwd()
  const dest = `${pwd}/${name}`
  const src = join(__dirname, '..', '..', '..', '..', 'templates', 'app')
  shell.cp('-R', src, dest)
  shell.sed('-i', 'APP_NAME', name, join(dest, 'package.json'))
  shell.sed('-i', 'APP_NAME', name, join(dest, 'README.md'))
  shell.sed('-i', 'APP_NAME', name, join(dest, 'src', 'index.ts'))
  return dest
}

function setupDependencies(dest: string) {
  shell.cd(dest)
  shell.exec('npm install', { silent: true })
}
