import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { sleep } from 'villa'
import DevCommand from '../../../commands/dev'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::Dev')
class DevCommandTest extends FunctionalTest {
  @timeout(210000)
  @slow(5000)
  @test
  async 'can cleanly stop a sg dev'() {
    this.addApi('hello', { path: '/' })
    this.addModel('todo')
    this.addPage('SomePage', { path: '/some_url' })
    this.addComponent('FunctionComp')
    this.addComponent('ClassComp', { class: true })
    const dev = new DevCommand()
    const promise = dev.execute()
    await sleep(4000)
    dev.stop()
    await promise
    process.env.NODE_ENV = 'test'
  }

  @timeout(210000)
  @slow(5000)
  @test
  async 'sg dev sets node_env'() {
    this.addApi('hello', { path: '/' })
    this.addModel('todo')
    this.addPage('SomePage', { path: '/some_url' })
    this.addComponent('FunctionComp')
    this.addComponent('ClassComp', { class: true })
    process.env.NODE_ENV = 'test'
    const dev = new DevCommand()
    const promise = dev.execute()
    await sleep(500)
    expect(process.env.NODE_ENV).to.equal('dev')
    dev.stop()
    await promise
    process.env.NODE_ENV = 'test'
  }
}
