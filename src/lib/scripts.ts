import * as browserify from 'browserify'
import { existsSync, readFileSync, writeFileSync } from 'fs'
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

export async function bundle(optimize = true): Promise<void> {
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
    browserify({ ignoreMissing: true })
      .add(src)
      .bundle()
  )
  let blob = data
  if (optimize) {
    blob = UglifyJS.minify(data).code
  }
  const dist = join(process.cwd(), '.seagull', 'assets', 'bundle.js')
  writeFileSync(dist, blob, { encoding: 'utf-8' })
}

export function modifyScriptExports(): void {
  const files = dir
    .files('.seagull/dist/backend/api', { sync: true })
    .filter(file => /\.js$/.test(file))
  const from = /exports\.default = (\w+);/
  const to = 'exports.default = $1;\nexports.handler = $1.dispatch.bind($1);'
  shell.sed('-i', from, to, files)
}

export function addImportIndex(): void {
  const frontendDir = join('.seagull', 'dist', 'frontend')
  function listFiles(directory: string): string[] {
    if (!existsSync(join(frontendDir, directory))) {
      return []
    }
    const files = dir
      .files(join(frontendDir, directory), {
        recursive: false,
        sync: true,
      })
      .filter(file => /\.js$/.test(file))

    return files || []
  }
  function buildImportKeys(files: string[]): string {
    return files
      .map(file => {
        const key = file
          .replace(/\.js$/, '')
          .split('/')
          .reverse()[0]
        return `${key}:require('${file.replace(frontendDir, './')}')`
      })
      .join(',\n')
  }
  const stores = listFiles('stores')
  const pages = listFiles('pages')
  const indexExport = `
    module.exports = {
      stores: {${buildImportKeys(stores)}},
      pages: {${buildImportKeys(pages)}}
    }
  `
  writeFileSync(join(frontendDir, 'index.js'), indexExport)
}
