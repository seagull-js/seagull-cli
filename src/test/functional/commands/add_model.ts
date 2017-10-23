import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::add:model')
class AddModelCommandTest extends FunctionalTest {
  @timeout(20000)
  @slow(5000)
  @test
  async 'can build a project with models'() {
    this.addModel('todo')
    await this.build()
  }
}
