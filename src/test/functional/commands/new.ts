import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import FunctionalTest from '../../helper/functional_test'

@suite('Commands::new')
class NewCommandTest extends FunctionalTest {
  @test
  'does generate a new project'() {
    expect(existsSync(this.appDir)).to.be.equal(true)
  }

  @test
  'project contains package.json file'() {
    const file = join(this.appDir, 'package.json')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(this.appName)
    const json = JSON.parse(text)
    expect(json.name).to.be.equal(this.appName)
    expect(json.version).to.be.equal('0.1.0')
  }

  @test
  'project contains tsconfig file'() {
    const file = join(this.appDir, 'tsconfig.json')
    expect(existsSync(file)).to.be.equal(true)
    const json = JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
    expect(json).to.be.an('object')
  }

  @test
  'project contains tslint file'() {
    const file = join(this.appDir, 'tslint.json')
    expect(existsSync(file)).to.be.equal(true)
    const json = JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
    expect(json).to.be.an('object')
  }

  @test
  'project contains api folder'() {
    const file = join(this.appDir, 'backend', 'api')
    expect(existsSync(file)).to.be.equal(true)
  }

  @test
  'project api folder contains Frontend.ts file'() {
    const file = join(this.appDir, 'backend', 'api', 'Frontend.ts')
    expect(existsSync(file)).to.be.equal(true)
  }

  @test
  'project contains frontend folder'() {
    const file = join(this.appDir, 'frontend')
    expect(existsSync(file)).to.be.equal(true)
  }

  @test
  'project frontend folder contains pages folder'() {
    const file = join(this.appDir, 'frontend', 'pages')
    expect(existsSync(file)).to.be.equal(true)
  }

  @test
  'project frontend pages folder contains hello.tsx file'() {
    const file = join(this.appDir, 'frontend', 'pages', 'hello.tsx')
    expect(existsSync(file)).to.be.equal(true)
  }

  @test
  'project frontend assets folder contains seagull png asset'() {
    const file = join(this.appDir, 'frontend', 'assets', 'seagull-logo.png')
    expect(existsSync(file)).to.be.equal(true)
  }

  @test
  'project frontend assets folder contains favicons'() {
    const file = join(
      this.appDir,
      'frontend',
      'assets',
      'favicons',
      'favicon.ico'
    )
    expect(existsSync(file)).to.be.equal(true)
  }
}
