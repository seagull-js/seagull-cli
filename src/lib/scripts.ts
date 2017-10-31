import * as browserify from 'browserify'
import { readFileSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import * as streamToString from 'stream-to-string'
import * as UglifyJS from 'uglify-es'

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

export async function bundle(): Promise<void> {
  const src = join(
    process.cwd(),
    '.seagull',
    'node_modules',
    '@seagull-js',
    'seagull',
    'dist',
    'lib',
    'spa',
    'entry.js'
  )
  const data: string = await streamToString(
    browserify()
      .add(src)
      .bundle()
  )
  const blob = UglifyJS.minify(data).code
  const dist = join(process.cwd(), '.seagull', 'assets', 'bundle.js')
  writeFileSync(dist, blob, { encoding: 'utf-8' })
}

export function modifyScriptExports(): void {
  const files = dir
    .files('.seagull/dist/api', { sync: true })
    .filter(file => /\.js$/.test(file))
  const from = /exports\.default = (\w+);/
  const to = 'exports.default = $1;\nexports.handler = $1.dispatch.bind($1);'
  shell.sed('-i', from, to, files)
}
