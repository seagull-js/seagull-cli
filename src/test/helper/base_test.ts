import { join } from 'path'
import * as shell from 'shelljs'

import AddApiCommand from '../../commands/add/api'
import AddComponentCommand from '../../commands/add/component'
import AddModelCommand from '../../commands/add/model'
import AddPageCommand from '../../commands/add/page'
import BuildCommand from '../../commands/build'
import NewCommand from '../../commands/new'
import ServeCommand from '../../commands/serve'

const cwd = shell.pwd().toString()
const appName = '__tmp__'
const appDir = join(cwd, appName)

export default class BaseTest {
  // static local variables
  static cwd = cwd
  static appName = appName
  static appDir = appDir

  // static command helpers
  static addApi = new AddApiCommand().execute
  static addComponent = new AddComponentCommand().execute
  static addModel = new AddModelCommand().execute
  static addPage = new AddPageCommand().execute
  static build = new BuildCommand().execute
  static create = new NewCommand().execute
  static serve = new ServeCommand().execute

  // local variables
  cwd = cwd
  appName = appName
  appDir = appDir

  // command helpers
  addApi = new AddApiCommand().execute
  addComponent = new AddComponentCommand().execute
  addModel = new AddModelCommand().execute
  addPage = new AddPageCommand().execute
  build = new BuildCommand().execute
  create = new NewCommand().execute
  serve = new ServeCommand().execute
}
