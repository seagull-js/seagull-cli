import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as shell from 'shelljs'
import BaseTest from './base_test'

@suite
export default class IntegrationTest extends BaseTest {
  // execute the command *once* before the tests
  before() {
    this.create(this.appName)
    shell.cd(this.appName)
  }

  // clean up the temporary folder after all test runs
  after() {
    shell.cd(this.cwd)
    shell.rm('-rf', this.appName)
  }
}
