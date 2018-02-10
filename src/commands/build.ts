import { Command, command, Context, metadata, option, Options } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import { cleanBuildDirectory } from '../lib/build/helper'
import {
  copyAssets,
  createServerlessYaml,
  initFolder,
  lint,
  prettier,
} from '../lib/build/helper'
import {
  addImportIndexFile,
  modifyScriptExports,
} from '../lib/build/transforms'

import { tsc } from '../lib/scripts'
import generateYAML from '../lib/serverless/generate-yaml'

import { Bundler } from '../lib/build/bundler'

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
    await compileScripts()
    copyAssets()
    createServerlessYaml()
    const bundler = new Bundler(optimize)
    await bundler.bundle()
  }
}

async function compileScripts() {
  if (existsSync(join(shell.pwd().toString(), 'backend', 'api'))) {
    if (process.env.NODE_ENV !== 'test') {
      lint()
      prettier()
    }
    await tsc()
    modifyScriptExports()
    addImportIndexFile()
  }
}
