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
  prettier
} from '../lib/build/helper'
import {addImportIndexFile, modifyScriptExports } from '../lib/build/transforms'

import {
  tsc,
} from '../lib/scripts'
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

function timeit(fn) {
  const hrstart = new Date()
  fn()
  const hrend = new Date().getTime() - hrstart.getTime()
  // tslint:disable-next-line:no-console
  console.info('Execution time (%s): %dms', fn.name, hrend)
}

async function asynctimeit(fn, arg) {
  const hrstart = new Date()
  await fn(arg)
  const hrend = new Date().getTime() - hrstart.getTime()
  // tslint:disable-next-line:no-console
  console.info('Execution time (%s): %dms', fn.name, hrend)
}
// tslint:disable-next-line:max-classes-per-file
@command({ description: 'compile a seagull app into a deployable bundle' })
export default class extends Command {
  @metadata
  async execute(options?: BuildOptions) {
    const optimize = options ? options.optimize : false
    timeit(initFolder)
    await asynctimeit(compileScripts, undefined)
    timeit(copyAssets)
    timeit(createServerlessYaml)
    const bundler = new Bundler(optimize)
    await asynctimeit(bundler.bundle, undefined)
  }
}

async function compileScripts() {
  if (existsSync(join(shell.pwd().toString(), 'backend', 'api'))) {
    if (process.env.NODE_ENV !== 'test') {
      timeit(lint)
      timeit(prettier)
    }
    await asynctimeit(tsc, undefined)
    timeit(modifyScriptExports)
    timeit(addImportIndexFile)
  }
}

