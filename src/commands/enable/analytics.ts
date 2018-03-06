import { generateAPI } from '@seagull/code-generators'
import { Command, command, param } from 'clime'
import { writeFileSync } from 'fs'
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

    // update package.json
    const pkgPath = join(pwd, 'package.json')
    const pkg: any = require(pkgPath)
    const sgConfig = pkg.seagull || {}
    sgConfig.analytics = {
      enabled: true,
      ga: id,
    }
    pkg.seagull = sgConfig
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')
    log('updated package.json seagull settings')
  }
}
