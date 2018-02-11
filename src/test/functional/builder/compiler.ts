import { expect } from 'chai'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'
import { sleep } from 'villa'
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
  async 'watching compiler compiles multiple added files'() {
    const file1 = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'AddedFile1.js'
    )

    const file2 = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'AddedFile2.js'
    )
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()

    await compilationIterator.next()
    expect(existsSync(file1)).to.be.equal(false)
    expect(existsSync(file2)).to.be.equal(false)

    this.addPage('AddedFile1', { path: '/some_url' })
    this.addPage('AddedFile2', { path: '/some_url' })

    await compilationIterator.next()
    expect(existsSync(file1)).to.be.equal(true)
    expect(existsSync(file2)).to.be.equal(true)

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

    await sleep(100)
    writeFileSync(
      join(this.appDir, 'frontend', 'pages', 'SomeStoppedChangedPage.tsx'),
      changedCode
    )

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

    writeFileSync(
      join(this.appDir, 'frontend', 'pages', 'SomeChangedPage.tsx'),
      changedCode
    )

    await compilationIterator.next()
    const newFileContent = readFileSync(file, 'utf8')
    // tslint:disable-next-line:no-unused-expression
    expect(newFileContent.indexOf(changedCode) > -1).to.be.true
    compiler.stop()
  }

  @test
  async 'watching compiler compiles renamed file'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomeRenamedPage.js'
    )
    const renamed = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'Renamed.js'
    )

    this.addPage('SomeRenamedPage', { path: '/some_url' })
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()
    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(true)

    renameSync(
      join(this.appDir, 'frontend', 'pages', 'SomeRenamedPage.tsx'),
      'Renamed.tsx'
    )

    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(false)
    expect(existsSync(renamed)).to.be.equal(false)
    compiler.stop()
  }

  @test
  async 'watching compiler removes deleted file'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomeDeletedPage.js'
    )

    this.addPage('SomeDeletedPage', { path: '/some_url' })
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()
    await compilationIterator.next()

    unlinkSync(join(this.appDir, 'frontend', 'pages', 'SomeDeletedPage.tsx'))

    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(false)
    compiler.stop()
  }

  @test
  async 'watching compiler removes deleted file in deleted folder'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'SomeDeletedPage.js'
    )

    this.addPage('SomeDeletedPage', { path: '/some_url' })
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()
    await compilationIterator.next()
    shell.rm('-Rf', join(this.appDir, 'frontend', 'pages'))

    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(false)
    compiler.stop()
  }

  @test
  async 'watching compiler compiles file in new folder'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pager',
      'newFolderFile.js'
    )
    const compiler = new Compiler()
    const compilationIterator = compiler.watch()

    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(false)

    mkdirSync(join(this.appDir, 'frontend', 'pager'))

    writeFileSync(
      join(this.appDir, 'frontend', 'pager', 'newFolderFile.ts'),
      'const x = 3'
    )
    await compilationIterator.next()
    expect(existsSync(file)).to.be.equal(true)

    compiler.stop()
  }
}