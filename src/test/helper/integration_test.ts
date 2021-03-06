import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as shell from 'shelljs'
import BaseTest from './base_test'

@suite
export default class IntegrationTest extends BaseTest {
  // execute the command *once* before the tests
  @timeout(150000)
  before() {
    this.create(this.appName)
    shell.ln('-s', '../node_modules', `./${this.appName}/node_modules`)
    shell.cd(this.appDir)
    process.chdir(this.appDir)
  }

  // clean up the temporary folder after all test runs
  after() {
    process.chdir(this.cwd)
    shell.cd(this.cwd)
    shell.rm('-rf', this.appDir)
  }
}
