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
    const server = this.serve()
    const data = await fetch('http://localhost:3000/hello')
    // tslint:disable-next-line:no-console
    // console.log('data', data)
    const json = await data.json()
    expect(json).to.be.equal('hello world')
    server.close()
  }
}
