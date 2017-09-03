import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::new')
class NewCommandTest extends FunctionalTest {
  @test('does generate a new project')
  canGenerateNewProject() {
    expect(existsSync(this.appDir)).to.be.equal(true)
  }

  @test('project contains README file')
  containsReadMe() {
    const file = join(this.appDir, 'README.md')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(this.appName)
  }

  @test('project contains package.json file')
  containsPackageJson() {
    const file = join(this.appDir, 'package.json')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(this.appName)
    const json = JSON.parse(text)
    expect(json.name).to.be.equal(this.appName)
    expect(json.version).to.be.equal('0.1.0')
  }

  @test('project contains tsconfig file')
  containsTsconfig() {
    const file = join(this.appDir, 'tsconfig.json')
    expect(existsSync(file)).to.be.equal(true)
    const json = JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
    expect(json).to.be.an('object')
  }

  @test('project contains tslint file')
  containsTslint() {
    const file = join(this.appDir, 'tslint.json')
    expect(existsSync(file)).to.be.equal(true)
    const json = JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
    expect(json).to.be.an('object')
  }
}
