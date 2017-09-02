import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'
import generate from '../../lib/serverless/generate-yaml'

import AddCommand from '../../commands/add/api'
import BuildCommand from '../../commands/build'
import NewCommand from '../../commands/new'

import App from '../../lib/loader/app'

const appName = '__tmp__'
const dir = join(shell.pwd().toString(), appName)

@suite()
class ServerlessYaml {
  // execute the command *once* before the tests
  static before() {
    new NewCommand().execute(appName)
    shell.cd(appName)
    new AddCommand().execute('Hello', '/hello')
    new BuildCommand().execute()
  }

  // clean up the temporary folder after all test runs
  static after() {
    shell.cd('../')
    shell.rm('-rf', appName)
  }

  @test('can generate a serverless.yml in memory')
  canGenerateYamlInMemory() {
    const folder = join(dir, '.seagull')
    const app = new App(folder)
    const yml = generate(app) // TODO: functions are badly formatted
    expect(yml).to.include('aws')
    expect(yml).to.include('runtime: nodejs6.10')
  }
}
