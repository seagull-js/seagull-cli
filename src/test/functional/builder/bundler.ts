import { expect } from 'chai'
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { sleep } from 'villa';
import { Bundler } from '../../../lib/build/bundler'
import { Compiler } from '../../../lib/build/compiler'
import App from '../../../lib/loader/app'
import { log } from '../../../lib/logger'
import { addImportIndex, modifyScriptExports } from '../../../lib/scripts';
import FunctionalTest from '../../helper/functional_test'

import * as shell from 'shelljs'

function compileAndModifySteps () {
  Compiler.compile()
  modifyScriptExports()
  addImportIndex()
}




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
    process.chdir(this.appDir)
    shell.mkdir('-p', this.bundleDir)
    if (!existsSync(join(this.appDir, '.seagull', 'node_modules'))) {
      shell.ln('-s', '../node_modules', `./.seagull/node_modules`)
    }
  }

  after() {
    process.chdir(join(this.appDir, '..'))
    if (!existsSync(this.bundlePath)) {
      return
    }
    unlinkSync(this.bundlePath)
  }

  @slow(5000)
  @test
  async 'can bundle a project staticly'() {
    const entry = join(
      process.cwd(),
      '.seagull',
      'node_modules',
      '@seagull-js',
      'seagull',
      'dist',
      'lib',
      'spa',
      'entry.js'
    )

    this.addPage('SomePage', { path: '/some_url' })
    compileAndModifySteps()
    expect(existsSync(this.bundlePath)).to.be.equal(false)
    await Bundler.bundle()
    expect(existsSync(this.bundlePath)).to.be.equal(true)
  }

  @slow(5000)
  @test
  async 'can bundle a project dynamicly'() {
    this.addPage('SomePage', { path: '/some_url' })
    compileAndModifySteps()
    const bundler = new Bundler()
    expect(existsSync(this.bundlePath)).to.be.equal(false)
    await bundler.bundle()
    expect(existsSync(this.bundlePath)).to.be.equal(true)
  }

  @test
  async 'can bundle an added file dynamicly'() {
    Compiler.compile()
    const bundler = new Bundler()
    let bundle = await bundler.bundle()

    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('some_added_url') > -1).to.be.false

    this.addPage('SomePage', { path: '/some_added_url' })
    compileAndModifySteps()
    bundle = await bundler.bundle()
    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('some_added_url') > -1).to.be.true
    expect(existsSync(this.bundlePath)).to.be.equal(true)
  }

  @test
  async 'can bundle a changed file dynamicly'() {
    const bundler = new Bundler()
    this.addPage('ChangedFile', { path: '/some_changed' })
    compileAndModifySteps()
    let bundle = await bundler.bundle()

    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('some_changed') > -1).to.be.true

    this.addPage('ChangedFile', { path: '/changed_some' })

    compileAndModifySteps()
    bundle = await bundler.bundle()
    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('some_changed') > -1).to.be.false
    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('changed_some') > -1).to.be.true
  }

  @test
  async 'can remove a deleted file from bundle'() {
    const bundler = new Bundler()
    this.addPage('DeletedFile', { path: '/deleted_string' })
    compileAndModifySteps()
    let bundle = await bundler.bundle()

    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('deleted_string') > -1).to.be.true

    unlinkSync(join(this.appDir, 'frontend', 'pages', 'DeletedFile.tsx'))
    unlinkSync(join(this.appDir, '.seagull', 'dist', 'frontend', 'pages', 'DeletedFile.js'))
    unlinkSync(join(this.appDir, '.seagull', 'dist', 'frontend', 'pages', 'DeletedFile.js.map'))
  
    compileAndModifySteps()
    bundle = await bundler.bundle()
    // tslint:disable-next-line:no-unused-expression
    expect(bundle.indexOf('deleted_string') > -1).to.be.false
  }

}
