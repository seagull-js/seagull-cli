import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::build')
class BuildCommandTest extends FunctionalTest {
  @timeout(20000)
  @slow(5000)
  @test
  async 'can build a project'() {
    this.addApi('hello', { path: '/' })
    await this.build()
  }

  @test
  'creates hidden subfolder in project'() {
    const folder = join(this.appDir, '.seagull')
    expect(existsSync(folder)).to.be.equal(true)
  }

  @test
  'creates serverless.yml in subfolder'() {
    const file = join(this.appDir, '.seagull', 'serverless.yml')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(this.appName)
  }

  @test
  'subfolder contains package.json file'() {
    const file = join(this.appDir, '.seagull', 'package.json')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(this.appName)
    const json = JSON.parse(text)
    expect(json.name).to.be.equal(this.appName)
    expect(json.version).to.be.equal('0.1.0')
  }

  @test
  'subfolder contains dist folder'() {
    const folder = join(this.appDir, '.seagull', 'dist')
    expect(existsSync(folder)).to.be.equal(true)
  }

  @test
  'api handler exports get rewritten'() {
    const file = join(this.appDir, '.seagull', 'dist', 'api', 'hello.js')
    const api = require(file)
    expect(api.default).to.be.a('function')
    expect(api.handler).to.be.a('function')
  }

  @test.skip
  'frontend folders get added and compiled'() {
    const file = join(
      this.appDir,
      '.seagull',
      'dist',
      'frontend',
      'pages',
      'example.js'
    )
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include('example')
  }

  @test
  'frontend gets browserified into a single file'() {
    const file = join(this.appDir, '.seagull', 'assets', 'bundle.js')
    expect(existsSync(file)).to.be.equal(true)
  }
}
