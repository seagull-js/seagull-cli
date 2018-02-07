import { mkdirSync, writeFileSync } from 'fs'
import { toPairs } from 'lodash'
import { join } from 'path'
import * as shell from 'shelljs'
import * as Gen from './index'

export default class App {
  dir: { [file: string]: string }

  constructor(private name: string) {
    const dir = {}
    dir['package.json'] = Gen.generatePackageJson(name)
    dir['tsconfig.json'] = Gen.generateTsconfigJson()
    dir['tslint.json'] = Gen.generateTslintJson()
    dir['backend/api/Frontend.ts'] = Gen.generateSsrApi()
    dir['frontend/layout.tsx'] = Gen.generateLayoutTsx(name)
    dir['frontend/pages/hello.tsx'] = Gen.generatePage('HelloPage', {
      path: '/',
    })
    this.dir = dir
  }

  toFolder(path: string) {
    this.createFolderStructure(path)
    this.copyExampleAssetFile(path)
    toPairs(this.dir).forEach(([file, text]) => {
      writeFileSync(join(path, file), text)
    })
  }

  createFolderStructure(path: string) {
    mkdirSync(path)
    mkdirSync(join(path, 'backend'))
    mkdirSync(join(path, 'backend', 'api'))
    mkdirSync(join(path, 'frontend'))
    mkdirSync(join(path, 'frontend/pages'))
    mkdirSync(join(path, 'frontend/assets'))
  }

  copyExampleAssetFile(path: string) {
    const srcFile = join(__dirname, '../../..', 'media', 'seagull-logo.png')
    const destFile = join(path, 'frontend', 'assets', 'seagull-logo.png')
    shell.cp(srcFile, destFile)
  }
}
