import { Command, command, Context, metadata, param } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import { lint, prettier, tsc } from '../../../lib/scripts'
import generateYAML from '../../../lib/serverless/generate-yaml'

@command({ description: 'compile a seagull app into a deployable bundle' })
export default class extends Command {
  @metadata
  execute() {
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

  // load package.json
  const pkgPath = join(pwd, 'package.json')
  const pkg = require(pkgPath)

  // load backend api routes
  let backend = []
  if (existsSync(join(pwd, '.seagull', 'dist', 'api'))) {
    const files = dir.files(join(pwd, '.seagull', 'dist', 'api'), {
      sync: true,
    })
    backend = files
      .filter(apiFile => /\.js$/.test(apiFile))
      .map(apiFile => require(apiFile).default)
      .map(api => new api())
  }

  // generate actual yaml
  const app = { backend, name: pkg.name }
  const yml = generateYAML(app)
  const ymlPath = join(pwd, '.seagull', 'serverless.yml')
  writeFileSync(ymlPath, yml)
}
