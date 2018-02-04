import { Command, command, Context, metadata, option, Options } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import App from '../lib/loader/app'
import {
  bundle,
  lint,
  modifyScriptExports,
  prettier,
  tsc,
} from '../lib/scripts'
import generateYAML from '../lib/serverless/generate-yaml'

class BuildOptions extends Options {
  @option({
    default: true,
    description: 'do an optimized build',
    flag: 'o',
    name: 'optimize',
    placeholder: 'true | false',
    required: false,
  })
  optimize: boolean
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'compile a seagull app into a deployable bundle' })
export default class extends Command {
  @metadata
  async execute(options?: BuildOptions) {
    const optimize = options ? options.optimize : false
    initFolder()
    compileScripts()
    copyAssets()
    createServerlessYaml()
    await bundle(optimize)
  }
}

function copyAssets() {
  if (!existsSync(join('frontend', 'assets'))) {
    return
  }

  if (dir.files('frontend/assets', { sync: true }).length === 0) {
    return
  }
  shell.cp('-R', 'frontend/assets/*', '.seagull/assets')
}

function initFolder() {
  shell.mkdir('-p', '.seagull')
  shell.cp('package.json', '.seagull/package.json')
  // dont link existing link
  if (!existsSync(join(shell.pwd().toString(), '.seagull', 'node_modules'))) {
    shell.ln('-s', '../node_modules', `./.seagull/node_modules`)
  }
  shell.mkdir('-p', '.seagull/assets')
}

function compileScripts() {
  if (existsSync(join(shell.pwd().toString(), 'backend', 'api'))) {
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
  const app = new App(pwd)

  const yml = generateYAML(app)
  const ymlPath = join(pwd, '.seagull', 'serverless.yml')
  writeFileSync(ymlPath, yml)
}
