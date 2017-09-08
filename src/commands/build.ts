import { Command, command, Context, metadata, param } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as shell from 'shelljs'
import App from '../lib/loader/app'
import {
  browserify,
  lint,
  modifyScriptExports,
  prettier,
  tsc,
} from '../lib/scripts'
import generateYAML from '../lib/serverless/generate-yaml'

@command({ description: 'compile a seagull app into a deployable bundle' })
export default class extends Command {
  @metadata
  execute() {
    initFolder()
    compileScripts()
    createServerlessYaml()
    browserify()
  }
}

function initFolder() {
  shell.mkdir('-p', '.seagull')
  shell.cp('package.json', '.seagull/package.json')
  if (existsSync(join(shell.pwd().toString(), 'node_modules'))) {
    shell.cp('-R', 'node_modules', '.seagull/node_modules')
  }
  shell.mkdir('-p', '.seagull/assets')
}

function compileScripts() {
  if (existsSync(join(shell.pwd().toString(), 'api'))) {
    if (process.env.NODE_ENV !== 'test') {
      lint()
      prettier()
    }
    tsc()
    modifyScriptExports()
  }
}

function createServerlessYaml() {
  const pwd = shell.pwd().toString()
  const app = new App(join(pwd, '.seagull'))

  const yml = generateYAML(app)
  const ymlPath = join(pwd, '.seagull', 'serverless.yml')
  writeFileSync(ymlPath, yml)
}
