import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as fetch from 'node-fetch'
import { join } from 'path'
import * as shell from 'shelljs'
import ServeCommand from '../../../commands/serve'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::serve')
class ServeCommandTest extends FunctionalTest {
  server = null
  after() {
    if (this.server) {
      this.server.close()
    }
  }

  @timeout(40000)
  @test
  async 'can build a project'() {
    this.addApi('hello', { path: '/hello' })
    this.addApi('responder', { path: '/responder' })
    const file = join(this.appDir, 'backend', 'api', 'responder.ts')
    const from = /return.+$/
    const to = `return this.text('hello, ' + request.params.name)`
    shell.sed('-i', from, to, file)
    await this.build()
  }

  @timeout(80000)
  @test
  async 'does load an app and starts the dev server'() {
    this.server = await this.serve()
    const data = await fetch('http://localhost:3000/hello')
    const text = await data.text()
    expect(text).to.be.equal('hello world')
  }

  @timeout(80000)
  @test
  async 'can start dev server on arbitrary port'() {
    this.server = await this.serve({ port: 4001 })
    const data = await fetch('http://localhost:4001/hello')
    const text = await data.text()
    expect(text).to.be.equal('hello world')
  }

  @timeout(80000)
  @test
  async 'does render html pages (SSR)'() {
    this.server = await this.serve()
    const data = await fetch('http://localhost:3000/')
    const html = await data.text()
    expect(html).to.include(`<title data-react-helmet="true"></title>`)
  }

  @timeout(80000)
  @test
  async 'does work with queryParameter'() {
    this.server = await this.serve()
    const data = await fetch('http://localhost:3000/responder?name=anon')
    const text = await data.text()
    expect(text).to.be.equal('hello, anon')
  }

  @timeout(80000)
  @test
  async 'does generate bundle.js in-memory'() {
    this.server = await this.serve()
    const data = await fetch('http://localhost:3000/assets/bundle.js')
    const jsblob = await data.text()
    expect(jsblob).to.be.a('string')
    expect(jsblob.length).to.be.above(1337)
  }

  @timeout(80000)
  @test
  async 'does serve assets'() {
    this.server = await this.serve()
    const data = await fetch('http://localhost:3000/assets/seagull-logo.png')
    expect(data.headers._headers['content-type']).to.be.deep.equal([
      'image/png',
    ])
  }

  @timeout(80000)
  @test
  async 'does serve favicons'() {
    this.server = await this.serve()
    const data = await fetch('http://localhost:3000/favicon-128.png')
    expect(data.headers._headers['content-type']).to.be.deep.equal([
      'image/png',
    ])
  }
}
