import { generateAPI } from '@seagull/code-generators'
import { Command, command, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { log } from '../../lib/logger'

@command({ description: 'scaffold a new api handler' })
export default class extends Command {
  execute(
    @param({
      description: 'google analytics id, looks like "UA-XXXXXX-X"',
      required: true,
    })
    id: string
  ) {
    // create API handler
    const body = `
      const { name } = request.body
      // tslint:disable-next-line
      console.log(name, JSON.stringify(request.body))
      return this.text('ok')
    `
    const gen = generateAPI('Track', { path: '/track', method: 'POST', body })
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'backend', 'api', `Track.ts`)
    gen.toFile(dest)
    log(`created backend tracking api in: ${dest}`)
  }
}
