import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as shell from 'shelljs'
import BaseTest from './base_test'
@suite
export default class FunctionalTest extends BaseTest {
  // execute the command *once* before the tests
  @timeout(150000)
  static before() {
    this.create(this.appName)
    shell.ln('-s', '../node_modules', `./${this.appName}/node_modules`)
    shell.cd(this.appName)
  }

  // clean up the temporary folder after all test runs
  static after() {
    shell.cd(this.cwd)
    shell.rm('-rf', this.appName)
  }
}
