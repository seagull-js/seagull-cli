import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'
import * as YAML from 'yamljs'
import App from '../../../lib/loader/app'
import Builder from '../../../lib/serverless/builder'
import generate from '../../../lib/serverless/generate-sls-config'
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
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.provider.name.should.to.be.equal('aws')
    yml.provider.runtime.should.to.be.equal('nodejs6.10')
    yml.provider.region.should.to.be.equal('eu-west-1')
    yml.provider.timeout.should.to.be.equal(30)
  }

  @test
  'yaml contains functions'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.functions.should.to.be.an('object')
    yml.functions.should.to.have.keys('api-Hello', 'api-Frontend')
  }

  @test
  'yaml functions have correct data fields'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    const fn = yml.functions['api-Hello']
    fn.timeout.should.to.be.equal(30)
    fn.events.should.to.be.an('array')
    fn.handler.should.to.be.equal('dist/backend/api/Hello.handler')
  }

  @test
  'frontend function has correct paths (/ and /*)'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    const fn = yml.functions['api-Frontend']
    fn.timeout.should.to.be.equal(30)
    fn.events.should.to.be.an('array')
    fn.events.should.to.have.length(2)
    fn.handler.should.to.be.equal('dist/backend/api/Frontend.handler')
  }

  @test
  'yaml contains tables'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.resources.Resources.todos.should.to.be.an('object')
    const table = yml.resources.Resources.todos
    table.Type.should.to.be.equal('AWS::DynamoDB::Table')
  }

  @test
  'yaml contains cloudfront distribution'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.resources.Resources.distribution.should.to.be.an('object')
  }

  @test
  'yaml contains s3 bucket'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.resources.Resources.appBucket.should.to.be.an('object')
  }

  @test
  'yaml contains s3 permission'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.resources.Resources.appBucketPermission.should.to.be.an('object')
  }
  @test
  'parse yml does not contain null values for previously just undefined values'() {
    const app = new Builder(undefined)
    const yml = YAML.parse(app.toYAML())
    // tslint:disable-next-line:no-unused-expression
    ;(yml.service === undefined).should.to.be.true
  }
  @test
  'yaml contains distribution access identity'() {
    const app = new App(this.appDir)
    const yml = YAML.parse(generate(app, { accountId: 'TESTACCID' }).toYAML())
    yml.resources.Resources.appDistributionAccessIdentity.should.to.be.an(
      'object'
    )
  }

  @test
  'get stack name of yaml builder works'() {
    const app = new App(this.appDir)
    const ymlBuilder = generate(app, { accountId: 'TESTACCID' })
    ymlBuilder.getStackName().should.be.equal('__tmp__-dev')
  }
  @test
  'get region id of yaml builder works'() {
    const app = new App(this.appDir)
    const ymlBuilder = generate(app, { accountId: 'TESTACCID' })
    ymlBuilder.getRegion().should.be.equal('eu-west-1')
  }
}
