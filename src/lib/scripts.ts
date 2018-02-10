import * as browserify from 'browserify'
import * as browserifyInc from 'browserify-incremental'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import * as streamToString from 'stream-to-string'
import * as UglifyJS from 'uglify-es'
import { Bundler } from './build/bundler'
import { Compiler } from './build/compiler'
import { binPath } from './build/helper'
import {addImportIndexFile, modifyScriptExports } from './build/transforms'

/**
 * These functions assume that the current PWD === app of the user !
 *
 * additionally, all shelljs commands are **synchronous** and return *void*
 */

export async function tsc(): Promise<void> {
  Compiler.compile()

  const bundler = new Bundler(false)
  for await (const bla of new Compiler().watch()) {
    // tslint:disable-next-line:no-console
    console.log('johoo')
    modifyScriptExports()
    addImportIndexFile()
    await bundler.bundle()
    // tslint:disable-next-line:no-console
    console.log('johoo')
  }
}
