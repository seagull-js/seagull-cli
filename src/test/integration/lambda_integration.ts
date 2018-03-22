import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import IntegrationTest from '../helper/integration_test'

@suite('Integration::aws_lambda')
class AwsLambdaIntegrationTest extends IntegrationTest {
  @timeout(150000)
  @slow(5000)
  @test
  async 'can invoke a function handler'() {
    const cache = 60
    this.addApi('hello', { path: '/hello', cache })
    await this.build()
    const event = {
      httpMethod: 'GET',
      path: '/hello',
      pathParameters: {},
      queryStringParameters: {},
    }
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'backend',
      'api',
      'hello.js'
    )
    const api = require(file).handler
    const response: any = await new Promise((resolve, reject) => {
      api(event, null, (error, result) => {
        error ? reject(error) : resolve(result)
      })
    })
    response.body.should.to.be.equal('hello world')
    response.headers.should.to.have.property('Cache-Control')
    response.headers['Cache-Control'].should.equal(`max-age=${cache}`)
  }
}
