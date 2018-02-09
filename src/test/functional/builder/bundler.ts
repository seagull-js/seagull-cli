import { expect } from 'chai'
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { sleep } from 'villa';
import { Bundler } from '../../../lib/build/bundler'
import { Compiler } from '../../../lib/build/compiler'
import App from '../../../lib/loader/app'
import { log } from '../../../lib/logger'
import FunctionalTest from '../../helper/functional_test'



@suite('builder::bundler')
class CompilerBuilderTest extends FunctionalTest {
  private buildDir = join(
    this.appDir,
    '.seagull'
  )
  private bundleDir = join(
    this.buildDir,
    'assets',
  )
  private bundlePath = join(
    this.bundleDir,
    'bundle.js'
  )

  before(){
    if (existsSync(this.bundleDir)) {
      return
    }
    mkdirSync(this.buildDir)
    mkdirSync(this.bundleDir)
  }

  after() {
    if (!existsSync(this.bundlePath)) {
      return
    }
    unlinkSync(this.bundlePath)
  }

  @slow(5000)
  @test
  async 'can bundle a file staticly'() {
    this.addPage('SomePage', { path: '/some_url' })
    Compiler.compile()
    expect(existsSync(this.bundlePath)).to.be.equal(false)
    await Bundler.bundle()
    expect(existsSync(this.bundlePath)).to.be.equal(true)
  }

  @slow(5000)
  @test
  async 'can bundle a file dynamicly'() {
    this.addPage('SomePage', { path: '/some_url' })
    Compiler.compile()
    expect(existsSync(this.bundlePath)).to.be.equal(false)
    await new Bundler().bundle()
    expect(existsSync(this.bundlePath)).to.be.equal(true)
  }

}
