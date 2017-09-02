import { Command, command, metadata, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { serve } from '../lib/scripts'

@command({ description: 'start local devserver for your app' })
export default class extends Command {
  @metadata
  execute() {
    log('> starting dev server with live reload ...')
    const app = serve()
    const server = app.listen(3000, () => log('server ready on localhost:3000'))
    return server
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
