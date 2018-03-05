import {
  addImportIndexFile,
  modifyScriptExports,
  writeConfig,
} from '@seagull/build-tools'
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

import generateYAML from '../lib/serverless/generate-yaml'

import { Bundler } from '@seagull/build-tools'
import { Compiler } from '@seagull/build-tools'
import { getAccountId } from '../lib/context'

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
    const optimize =
      options && process.env.NODE_ENV !== 'test' ? options.optimize : false
    if (process.env.NODE_ENV !== 'test') {
      lint()
      prettier()
    }
    cleanBuildDirectory()
    initFolder()
    Compiler.compile()
    modifyScriptExports()
    addImportIndexFile()
    copyAssets()
    writeConfig()
    await Bundler.bundle(optimize)

    const accountId = await getAccountId()
    createServerlessYaml(accountId)
  }
}
