import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'

import Command from '../../cli/commands/new/default'

const appName = '__tmp__'
const dir = join(shell.pwd().toString(), appName)

@suite('CLI::new')
class Integration {
  // execute the command *once* before the tests
  public static before() {
    new Command().execute(appName)
  }

  // clean up the temporary folder after all test runs
  public static after() {
    shell.rm('-rf', appName)
  }

  @test('does generate a new project')
  public canGenerateNewProject() {
    expect(existsSync(dir)).to.be.equal(true)
  }

  @test('project contains README file')
  public containsReadMe() {
    const file = join(dir, 'README.md')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(appName)
  }

  @test('project contains package.json file')
  public containsPackageJson() {
    const file = join(dir, 'package.json')
    expect(existsSync(file)).to.be.equal(true)
    const text = readFileSync(file, { encoding: 'utf-8' })
    expect(text).to.include(appName)
    const json = JSON.parse(text)
    expect(json.name).to.be.equal(appName)
    expect(json.version).to.be.equal('0.1.0')
  }

  @test('project contains tsconfig file')
  public containsTsconfig() {
    const file = join(dir, 'tsconfig.json')
    expect(existsSync(file)).to.be.equal(true)
    const json = JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
    expect(json).to.be.an('object')
  }

  @test('project contains tslint file')
  public containsTslint() {
    const file = join(dir, 'tslint.json')
    expect(existsSync(file)).to.be.equal(true)
    const json = JSON.parse(readFileSync(file, { encoding: 'utf-8' }))
    expect(json).to.be.an('object')
  }

  @test('project contains src folder')
  public containsSrcFolder() {
    const folder = join(dir, 'src')
    expect(existsSync(folder)).to.be.equal(true)
  }

  @test('project contains index.ts file in src folder')
  public containsIndexTs() {
    const file = join(dir, 'src', 'index.ts')
    expect(existsSync(file)).to.be.equal(true)
  }
}
