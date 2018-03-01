import { App } from '@seagull/code-generators'
import { Command, command, param } from 'clime'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import { log } from '../lib/logger'

@command({ description: 'create a new seagull app' })
export default class extends Command {
  execute(
    @param({ description: 'name of the app', required: true })
    name: string
  ) {
    log('scaffolding new seagull app...')
    const dest = join(shell.pwd().toString(), name)
    const app = new App(name, frameworkVersion())
    app.toFolder(dest)
    // const dest = copyTemplateFolder(name)
    if (process.env.NODE_ENV === 'test') {
      log('skipping dependencies...')
    } else {
      log('installing dependencies...')
      setupDependencies(dest)
    }
    log(`created app in: ${dest}`)
  }
}

function setupDependencies(dest: string) {
  shell.cd(dest)
  shell.exec('npm install', { silent: true })
}

function frameworkVersion(): string {
  const file = join(__dirname, '..', '..', 'package.json')
  const pkg = require(file)
  return pkg.dependencies['@seagull/core']
}
