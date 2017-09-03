import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'

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

export function modifyScriptExports(): void {
  const files = dir
    .files('.seagull/dist/api', { sync: true })
    .filter(file => /\.js$/.test(file))
  const from = /exports\.default = (\w+);/
  const to = 'exports.default = $1;\nexports.handler = $1.dispatch.bind($1);'
  shell.sed('-i', from, to, files)
}
