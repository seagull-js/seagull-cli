import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generateSsrApi } from '../../../lib/codegen'

@suite
class CodegenGenerateSsrApiTest {
  @test
  'can generate SSR API'() {
    const gen = generateSsrApi()
    const code = gen.toString()
    expect(code).to.contain('export default class Frontent extends API {')
    expect(code).to.contain('async handle(request: Request): Promise<Response>')
  }

  @test
  'contains correct imports'() {
    const gen = generateSsrApi()
    const code = gen.toString()
    expect(code).to.contain(`import { API, Request, Response } from '@seagull`)
    expect(code).to.contain(`import { Routing } from '@seagull`)
    expect(code).to.contain(`import { renderToString } from 'react-dom/server'`)
    expect(code).to.contain(`import { getStyles } from 'typestyle'`)
    expect(code).to.contain(`import layout from '../../frontend/layout'`)
  }

  @test
  'contains correct path'() {
    const gen = generateSsrApi()
    const code = gen.toString()
    expect(code).to.contain(`static path: string = '/*'`)
  }

  @test
  'contains correct http method'() {
    const gen = generateSsrApi()
    const code = gen.toString()
    expect(code).to.contain(`static method: string = 'GET'`)
  }

  @test
  'has correct handler body'() {
    const gen = generateSsrApi()
    const code = gen.toString()
    expect(code).to.contain(`return this.html(`)
    expect(code).to.contain(`renderToString(layout({ children: appRouter`)
  }
}
