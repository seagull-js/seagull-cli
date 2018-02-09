import { expect } from 'chai'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { sleep } from 'villa';
import { Compiler } from '../../../lib/build/compiler'
import App from '../../../lib/loader/app'
import { log } from '../../../lib/logger'
import FunctionalTest from '../../helper/functional_test'

@suite('builder::compiler')
class CompilerBuilderTest extends FunctionalTest {
  @slow(5000)
  @test
  async 'can compile a file staticly'() {
    this.addPage('SomePage', { path: '/some_url' })
    Compiler.compile()
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomePage.js'
    )
    expect(existsSync(file)).to.be.equal(true)
  }

  @slow(5000)
  @test
  async 'watching compiler notifies about finished initial compile'() {
    this.addPage('SomePage', { path: '/some_url' })
    const compiler = new Compiler() 
    for await (const noMsg of compiler.watch()) {
      // tslint:disable-next-line:no-console
      console.log('jo')
      expect(true).equals(true)
      break
    }
    compiler.stop()
  }

  @test
  async 'watching compiler compiles added file'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'AddedFile.js'
    )
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()

    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(false)

    this.addPage('AddedFile', { path: '/some_url' })

    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(true)

    compiler.stop()
  }

  @test
  async 'stopped watching compiler does not compile added'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomeStoppedAddedPage.js'
    )

    const compiler = new Compiler()
    const compilationIterator = compiler.watch()
    await compilationIterator.next()
    compiler.stop()

    this.addPage('SomeStoppedAddedPage', { path: '/some_url' })
    await sleep(500)
    expect(existsSync(file)).to.be.equal(false)
  }

  @test
  async 'stopped watching compiler does not compile changed'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomeStoppedChangedPage.js'
    )
    const changedCode = 'const x = 3'
    this.addPage('SomeStoppedChangedPage', { path: '/some_url' })
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()
    await compilationIterator.next()
    compiler.stop()

    await sleep(500)
    log('write new file')
    writeFileSync(join(this.appDir, 'frontend', 'pages', 'SomeStoppedChangedPage.tsx'), changedCode)

    await sleep(500)
    expect(readFileSync(file, 'utf8')).to.be.not.equal(changedCode)
  }

  @test
  async 'watching compiler compiles changed file'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomeChangedPage.js'
    )
    const changedCode = 'const x = 3'

    this.addPage('SomeChangedPage', { path: '/some_url' })
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()
    await compilationIterator.next()

    writeFileSync(join(this.appDir, 'frontend', 'pages', 'SomeChangedPage.tsx'), changedCode)

    await compilationIterator.next()
    await sleep(500)
    expect(readFileSync(file, 'utf8')).to.be.not.equal(changedCode)
    compiler.stop()
  }

  /*@test
  async 'watching compiler compiles renamed file'() {
    this.addPage('SomePages', { path: '/some_url' })
  }

  @test
  async 'watching compiler removes deleted file'() {
    this.addPage('SomePages', { path: '/some_url' })
  }
  */
}
