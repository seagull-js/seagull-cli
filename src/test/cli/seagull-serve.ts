import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import * as fetch from 'node-fetch'
import { join } from 'path'
import * as shell from 'shelljs'

import BuildCommand from '../../cli/commands/build/default'
import GenerateCommand from '../../cli/commands/generate/api/default'
import NewCommand from '../../cli/commands/new/default'
import ServeCommand from '../../cli/commands/serve/default'

const appName = '__tmp__'
const dir = join(shell.pwd().toString(), appName)

@suite('CLI::serve')
class Integration {
  // execute the command *once* before the tests
  static before() {
    new NewCommand().execute(appName)
    process.chdir(appName)
    new GenerateCommand().execute('Hello', '/hello')
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
    // const data = await fetch('http://localhost:3000/hello')
    // const json = await data.json()
    // expect(json).to.be.equal('world')
    server.close()
  }
}
