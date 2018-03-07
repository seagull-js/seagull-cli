import { expect } from 'chai'
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
    this.addApi('hello', { path: '/hello' })
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/hello')
    const text = await data.text()
    expect(text).to.be.equal('hello world')
    server.close()
  }

  @timeout(80000)
  @test
  async 'does render html favicons'() {
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/')
    const html = await data.text()
    expect(html).to.include(`favicon.ico`)
  }
}
