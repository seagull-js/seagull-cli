import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as fetch from 'node-fetch'
import IntegrationTest from '../helper/integration_test'

@suite('Quickstart::intro')
class LoaderAppTest extends IntegrationTest {
  @test
  async 'can build and serve an new empty app'() {
    const server = this.serve()
    server.close()
  }

  @test
  async 'can build and serve an app with api routes'() {
    this.addApi('hello', { path: '/hello' })
    const server = this.serve()
    const data = await fetch('http://localhost:3000/hello')
    const json = await data.json()
    expect(json).to.be.equal('hello world')
    server.close()
  }
}
