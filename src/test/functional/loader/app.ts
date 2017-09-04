import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import App from '../../../lib/loader/app'
import FunctionalTest from '../../helper/functional_test'

@suite('Loader::app')
class LoaderAppTest extends FunctionalTest {
  @test
  'can build a project'() {
    this.addApi('hello', { path: '/hello' })
    this.build()
  }

  @test
  'can load demo project with api handlers'() {
    const folder = join(this.appDir, '.seagull')
    const app = new App(folder)
    // tslint:disable-next-line:no-console
    // console.log(app)
    expect(app.name).to.be.equal('__tmp__')
    expect(app.backend).to.have.length(1)
  }
}
