import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'

import BuildCommand from '../../cli/commands/build/default'
import GenerateCommand from '../../cli/commands/generate/api/default'
import NewCommand from '../../cli/commands/new/default'

const appName = '__tmp__'
const dir = join(shell.pwd().toString(), appName)

@suite('CLI::build')
class Integration {
  // execute the command *once* before the tests
  static before() {
    new NewCommand().execute(appName)
    process.chdir(appName)
    new GenerateCommand().execute('Hello', '/')
    new BuildCommand().execute()
  }

  // clean up the temporary folder after all test runs
  static after() {
    process.chdir('../')
    shell.rm('-rf', appName)
  }

  @test('creates hidden subfolder in project')
  canGenerateNewProject() {
    const folder = join(dir, '.seagull')
    expect(existsSync(folder)).to.be.equal(true)
  }

  @test('creates serverless.yml in subfolder')
  canGenerateServerlessYaml() {
    const file = join(dir, '.seagull', 'serverless.yml')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(appName)
  }

  @test('subfolder contains package.json file')
  containsPackageJson() {
    const file = join(dir, '.seagull', 'package.json')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(appName)
    const json = JSON.parse(text)
    expect(json.name).to.be.equal(appName)
    expect(json.version).to.be.equal('0.1.0')
  }

  @test('subfolder contains dist folder')
  containsSrcFolder() {
    const folder = join(dir, '.seagull', 'dist')
    expect(existsSync(folder)).to.be.equal(true)
  }
}
