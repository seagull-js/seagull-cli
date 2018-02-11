import { Command, command, metadata, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { getLatestVersion } from '../lib/npm'

export class SomeOptions extends Options {
  @option({
    description: 'print current version number',
    flag: 'v',
    name: 'version',
    required: false,
    toggle: true,
  })
  version?: boolean
}

const description = `
The Seagull Framework
=====================

This is some text. Lorem ipsum dolor sit amet consectetur
adipisicing elit. Iusto quasi quibusdam officiis ratione impedit
nihil tenetur recusandae voluptas voluptatum, odit possimus dicta,
vel nobis soluta fugiat non atque dignissimos aperiam.
`

// tslint:disable-next-line:max-classes-per-file
@command({ description })
export default class extends Command {
  @metadata
  async execute(options: SomeOptions) {
    if (options.version) {
      const { version } = require(join(__dirname, '../../package.json'))
      const latest: any = await getLatestVersion('@seagull-js/seagull-cli')
      // tslint:disable-next-line:no-console
      console.log(`Seagull CLI version: ${version}, latest: `, latest.version)
    } else {
      shell.exec('seagull -h')
    }
  }
}
