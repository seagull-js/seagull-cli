import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::build')
class BuildCommandTest extends FunctionalTest {
  @test
  'can build a project'() {
    this.addApi('hello', '/') // there must be "something" for the tsc to do
    this.build()
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
}
