import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as fetch from 'node-fetch'
import IntegrationTest from '../helper/integration_test'

@suite('Quickstart::intro')
class LoaderAppTest extends IntegrationTest {
  @timeout(60000)
  @test
  async 'can build and serve an new empty app'() {
    const server = await this.serve()
    server.close()
  }

  @timeout(60000)
  @test
  async 'can build and serve an app with api routes'() {
    const cache = 60
    this.addApi('hello', { path: '/hello', cache })
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/hello')

    data.headers._headers['cache-control'][0].should.be.equal(
      `max-age=${cache}`
    )
    const text = await data.text()
    text.should.to.be.equal('hello world')
    server.close()
  }

  @timeout(80000)
  @test
  async 'does render html favicons'() {
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/')
    const html = await data.text()
    html.should.to.include(`favicon.ico`)
    server.close()
  }
}
