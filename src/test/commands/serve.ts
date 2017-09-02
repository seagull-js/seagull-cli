import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as fetch from 'node-fetch'
import { join } from 'path'
import * as shell from 'shelljs'

import AddCommand from '../../commands/add/api'
import BuildCommand from '../../commands/build'
import NewCommand from '../../commands/new'
import ServeCommand from '../../commands/serve'

const appName = '__tmp__'
const dir = join(shell.pwd().toString(), appName)

@suite('CLI::serve')
class Integration {
  // execute the command *once* before the tests
  static before() {
    new NewCommand().execute(appName)
    process.chdir(appName)
    new AddCommand().execute('Hello', '/hello')
    new BuildCommand().execute()
  }

  // clean up the temporary folder after all test runs
  static after() {
    process.chdir('../')
    shell.rm('-rf', appName)
  }

  @test('does load an app and starts the dev server')
  async canGenerateNewProject() {
    const server = new ServeCommand().execute()
    const data = await fetch('http://localhost:3000/hello')
    // tslint:disable-next-line:no-console
    // console.log('data', data)
    const json = await data.json()
    expect(json).to.be.equal('hello world')
    server.close()
  }
}
