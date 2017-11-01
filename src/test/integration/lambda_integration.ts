import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import IntegrationTest from '../helper/integration_test'

@suite('Integration::aws_lambda')
class AwsLambdaIntegrationTest extends IntegrationTest {
  @timeout(150000)
  @slow(5000)
  @test
  async 'can invoke a function handler'() {
    this.addApi('hello', { path: '/hello' })
    await this.build()
    const event = {
      httpMethod: 'GET',
      path: '/hello',
      pathParameters: {},
      queryStringParameters: {},
    }
    const file = join(this.appDir, '.seagull', 'dist', 'api', 'hello.js')
    const api = require(file).handler
    const response: any = await new Promise((resolve, reject) => {
      api(event, null, (error, result) => {
        error ? reject(error) : resolve(result)
      })
    })
    // tslint:disable-next-line:no-console
    // console.log('response: ', response)
    expect(response.body).to.be.equal('hello world')
  }
}
