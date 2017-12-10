import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import App from '../../../lib/loader/app'
import FunctionalTest from '../../helper/functional_test'

@suite('Loader::app')
class LoaderAppTest extends FunctionalTest {
  @timeout(60000)
  @test
  async 'can build a project'() {
    this.addApi('hello', { path: '/hello' })
    this.addModel('todo')
    await this.build()
  }

  @test
  'can load demo project with api handlers'() {
    const app = new App(this.appDir)
    expect(app.name).to.be.equal('__tmp__')
    expect(app.backend).to.have.length(2)
  }

  @test
  'can load demo project with data models'() {
    const app = new App(this.appDir)
    expect(app.models).to.have.length(1)
  }
}
