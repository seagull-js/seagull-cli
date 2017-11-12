import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as fetch from 'node-fetch'
import { join } from 'path'
import ServeCommand from '../../../commands/serve'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::serve')
class ServeCommandTest extends FunctionalTest {
  @test
  'can build a project'() {
    this.addApi('hello', { path: '/hello' })
  }

  @test
  async 'does load an app and starts the dev server'() {
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/hello')
    const text = await data.text()
    expect(text).to.be.equal('hello world')
    server.close()
  }

  @timeout(80000)
  @test
  async 'does render html pages (SSR)'() {
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/')
    const html = await data.text()
    expect(html).to.include(`<title>${this.appName}</title>`)
    server.close()
  }

  @timeout(80000)
  @test
  async 'does generate bundle.js in-memory'() {
    const server = await this.serve()
    const data = await fetch('http://localhost:3000/assets/bundle.js')
    const jsblob = await data.text()
    expect(jsblob).to.be.a('string')
    expect(jsblob.length).to.be.above(1337)
    server.close()
  }
}
