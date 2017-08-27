import { Command, command, Context, metadata, param } from 'clime'
import { writeFileSync } from 'fs'
import { join } from 'path'
import * as shell from 'shelljs'
import { lint, prettier, tsc } from '../../../lib/scripts'
import generateYAML from '../../../lib/serverless/generate-yaml'

@command({ description: 'compile a seagull app into a deployable bundle' })
export default class extends Command {
  @metadata
  public execute() {
    initFolder()
    compileScripts()
    createServerlessYaml()
  }
}

function initFolder() {
  shell.mkdir('-p', '.seagull')
  shell.cp('package.json', '.seagull/package.json')
  shell.cp('-R', 'node_modules', '.seagull/node_modules')
}

function compileScripts() {
  if (process.env.NODE_ENV !== 'test') {
    lint()
    prettier()
  }
  tsc()
}

function createServerlessYaml() {
  const pwd = shell.pwd().toString()
  const pkgPath = join(pwd, 'package.json')
  const pkg = require(pkgPath)
  const file = pkg.main.replace(/ts$/, 'js').replace(/^src/, 'dist')
  const appPath = join(pwd, '.seagull', file)
  const app = require(appPath)
  const yml = generateYAML(app)
  const ymlPath = join(pwd, '.seagull', 'serverless.yml')
  writeFileSync(ymlPath, yml)
}
