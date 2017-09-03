import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'

import AddCommand from '../../commands/add/api'
import BuildCommand from '../../commands/build'
import NewCommand from '../../commands/new'

const cwd = shell.pwd().toString()
const appName = '__tmp__'
const appDir = join(shell.pwd().toString(), appName)

@suite
export default class FunctionalTest {
  // execute the command *once* before the tests
  static before() {
    new NewCommand().execute(appName)
    shell.cd(appName)
  }

  // clean up the temporary folder after all test runs
  static after() {
    shell.cd(cwd)
    shell.rm('-rf', appName)
  }

  // local variables
  appName = appName
  appDir = appDir

  // command helpers
  build() {
    new BuildCommand().execute()
  }

  addApi(name, path) {
    new AddCommand().execute(name, path)
  }
}
