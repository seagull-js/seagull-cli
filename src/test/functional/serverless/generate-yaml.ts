import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'
import * as YAML from 'yamljs'
import App from '../../../lib/loader/app'
import generate from '../../../lib/serverless/generate-yaml'
import FunctionalTest from '../../helper/functional_test'

@suite('Serverless::generate_yaml')
class ServeCommandTest extends FunctionalTest {
  @test
  'can build a project'() {
    this.addApi('Hello', { path: '/hello' }) // there must be "something" for the tsc to do
    this.build()
  }

  @test
  'can generate a serverless.yml in memory'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.provider.name).to.be.equal('aws')
    expect(yml.provider.runtime).to.be.equal('nodejs6.10')
    expect(yml.provider.region).to.be.equal('eu-central-1')
    expect(yml.provider.timeout).to.be.equal(30)
  }

  @test
  'yaml contains functions'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.functions).to.be.an('object')
    expect(yml.functions).to.have.key('api-Hello')
  }

  @test
  'yaml functions have correct data fields'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    const fn = yml.functions['api-Hello']
    expect(fn.timeout).to.be.equal(30)
    expect(fn.events).to.be.an('array')
    expect(fn.handler).to.be.equal('dist/api/Hello.handler')
  }
}
