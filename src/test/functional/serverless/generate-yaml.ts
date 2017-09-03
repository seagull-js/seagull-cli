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
    this.addApi('hello', '/hello') // there must be "something" for the tsc to do
    this.build()
  }

  @test('can generate a serverless.yml in memory')
  canGenerateYamlInMemory() {
    const folder = join(this.appDir, '.seagull')
    const app = new App(folder)
    const yml = generate(app) // TODO: functions are badly formatted
    // tslint:disable-next-line:no-console
    // console.log(yml)
    expect(yml).to.include('aws')
    expect(yml).to.include('runtime: nodejs6.10')
    const obj = YAML.parse(yml)
    expect(obj.functions).to.be.an('object')
    expect(obj.functions).to.have.key('__tmp__-api-hello')
    const fn = obj.functions['__tmp__-api-hello']
    expect(fn.timeout).to.be.equal(30)
    expect(fn.events).to.be.an('array')
  }
}
