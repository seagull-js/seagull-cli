import { existsSync, readFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import wrapApp from './devserver'

/**
 * These functions assume that the current PWD === app of the user !
 *
 * additionally, all shelljs commands are **synchronous** and return *void*
 */

function binPath(name: string): string {
  return join(__dirname, '..', '..', 'node_modules', '.bin', name)
}

export function lint(): void {
  shell.exec(`${binPath('tslint')} -c tslint.json --fix src/**/*.ts`)
}

export function prettier(): void {
  const args = '--single-quote --no-semi --trailing-comma es5'
  const cmd = `${binPath('prettier')} ${args} --write src/**/*.ts`
  shell.exec(cmd, { silent: true })
}

export function tsc(): void {
  shell.rm('-rf', '.seagull/dist')
  shell.exec(`${binPath('tsc')}`)
}

export function serve(): any {
  const path = join(shell.pwd().toString(), '.seagull', 'dist', 'api')
  let backend = []
  if (existsSync(path)) {
    backend = dir
      .files(path, { sync: true })
      .filter(file => /\.js$/.test(file))
      .map(file => {
        delete require.cache[file] // do not remove this
        return require(file).default
      })
  }
  const app = { backend }
  return wrapApp(app)
}
