import { existsSync, readFileSync, writeFileSync } from 'fs'
import { set } from 'lodash'
import * as dir from 'node-dir'
import { basename, join } from 'path'
import * as shell from 'shelljs'

export function modifyScriptExports(): void {
  const files = dir
    .files('.seagull/dist/backend/api', { sync: true })
    .filter(file => /\.js$/.test(file))
  const from = /exports\.default = (\w+);/
  const to = 'exports.default = $1;\nexports.handler = $1.dispatch.bind($1);'
  shell.sed('-i', from, to, files)
}

export function addImportIndexFile(): void {
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
        return `"${key}":require("${file.replace(frontendDir, '.')}")`
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

export function writeConfig() {
  const configDir = '.seagull'
  const faviconDir = join('.seagull', 'assets', 'favicons')
  if (!existsSync(faviconDir)) {
    return null
  }
  const faviconFiles = dir
    .files(faviconDir, {
      recursive: false,
      sync: true,
    })
    .map(path => basename(path))

  const conf = JSON.parse(
    readFileSync(join(configDir, 'package.json'), 'utf-8')
  )
  set(conf, 'seagull.faviconFiles', faviconFiles)
  writeFileSync(join(configDir, 'package.json'), JSON.stringify(conf))
}
