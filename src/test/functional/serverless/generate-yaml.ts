import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'
import * as YAML from 'yamljs'
import App from '../../../lib/loader/app'
import Builder from '../../../lib/serverless/builder'
import generate from '../../../lib/serverless/generate-yaml'
import FunctionalTest from '../../helper/functional_test'

@suite('Serverless::generate_yaml')
class ServeCommandTest extends FunctionalTest {
  @timeout(60000)
  @test
  async 'can build a project'() {
    this.addApi('Hello', { path: '/hello' })
    this.addModel('todos')
    await this.build()
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
    expect(yml.functions).to.have.keys('api-Hello', 'api-Frontend')
  }

  @test
  'yaml functions have correct data fields'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    const fn = yml.functions['api-Hello']
    expect(fn.timeout).to.be.equal(30)
    expect(fn.events).to.be.an('array')
    expect(fn.handler).to.be.equal('dist/backend/api/Hello.handler')
  }

  @test
  'frontend function has correct paths (/ and /*)'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    const fn = yml.functions['api-Frontend']
    expect(fn.timeout).to.be.equal(30)
    expect(fn.events).to.be.an('array')
    expect(fn.events).to.have.length(2)
    expect(fn.handler).to.be.equal('dist/backend/api/Frontend.handler')
  }

  @test
  'yaml contains tables'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.resources.Resources.todos).to.be.an('object')
    const table = yml.resources.Resources.todos
    expect(table.Type).to.be.equal('AWS::DynamoDB::Table')
  }

  @test
  'yaml contains cloudfront distribution'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.resources.Resources.distribution).to.be.an('object')
  }

  @test
  'yaml contains s3 bucket'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.resources.Resources.appBucket).to.be.an('object')
  }

  @test
  'yaml contains s3 permission'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.resources.Resources.appBucketPermission).to.be.an('object')
  }
  @test
  'parse yml does not contain null values for previously just undefined values'() {
    const app = new Builder(undefined)
    const yml = YAML.parse(app.toYAML())
    expect(yml.service).to.be.equal(undefined)
  }
  @test
  'yaml contains distribution access identity'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app))
    expect(yml.resources.Resources.appDistributionAccessIdentity).to.be.an(
      'object'
    )
  }
}
