import { expect } from 'chai'
import { existsSync, readFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'

import AddCommand from '../../commands/add/api'
import BuildCommand from '../../commands/build'
import NewCommand from '../../commands/new'

import App from '../../lib/loader/app'

const appName = '__tmp__'
const dir = join(shell.pwd().toString(), appName)

@suite('Loader::app')
class Integration {
  // execute the command *once* before the tests
  static before() {
    new NewCommand().execute(appName)
    shell.cd(appName)
  }

  // clean up the temporary folder after all test runs
  static after() {
    shell.cd('../')
    shell.rm('-rf', appName)
  }

  @test
  'can load demo project with api handlers'() {
    new AddCommand().execute('Hello', '/hello')
    new BuildCommand().execute()
    const folder = join(dir, '.seagull')
    const app = new App(folder)
    // tslint:disable-next-line:no-console
    // console.log(app)
    expect(app.name).to.be.equal('__tmp__')
    expect(app.backend).to.have.length(1)
  }

  @test
  'can load demo project without api handlers'() {
    new BuildCommand().execute()
    const folder = join(dir, '.seagull')
    const app = new App(folder)
    expect(app.name).to.be.equal('__tmp__')
    expect(app.backend).to.have.length(1)
  }
}
