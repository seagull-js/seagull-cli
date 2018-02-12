import { Command, command, metadata } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'upgrade Seagull CLI itself to latest version' })
export default class extends Command {
  @metadata
  async execute() {
    shell.exec('npm update -g @seagull/cli')
  }
}
