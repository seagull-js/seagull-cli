import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as shell from 'shelljs'

import ApiHandler from '../../../lib/loader/api/api_handler'

@suite()
class ApiHandlerTest {
  @test
  'can load an API handler directly from file'() {
    const file = join(process.cwd(), 'templates', 'api', 'handler.ts')
    const handler: any = new ApiHandler('myapp', file)
    expect(handler.appName).to.be.equal('myapp')
    expect(handler.filePath).to.be.equal(file)
    expect(handler.name).to.include('api-handler')
    expect(handler.module).to.be.a('function')
    expect(handler.module.path).to.be.equal(undefined)
    expect(handler.module.method).to.be.equal('GET')
    expect(handler.handler).to.include('handler.handler')
  }
}
