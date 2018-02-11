import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generatePage } from '../../../lib/codegen'

@suite
class CodegenGeneratePageTest {
  @test
  'can generate minimal API'() {
    const gen = generatePage('MyPage', { path: '/' })
    const code = gen.toString()
    expect(code).to.contain('export default class MyPage extends Page<{}, {}>')
  }

  @test
  'begins with correct react import'() {
    const gen = generatePage('MyPage', { path: '/' })
    const code = gen.toString()
    expect(code).to.contain(`import * as React from 'react'`)
  }

  @test
  'contains correct Page import'() {
    const gen = generatePage('MyPage', { path: '/something' })
    const code = gen.toString()
    expect(code).to.contain(`import { Page } from '@seagull/core'`)
  }

  @test
  'contains correct path setting as prop'() {
    const gen = generatePage('MyPage', { path: '/something' })
    const code = gen.toString()
    expect(code).to.contain(`path: string = '/something'`)
  }

  @test
  'contains render method'() {
    const gen = generatePage('MyPage', { path: '/something' })
    const code = gen.toString()
    expect(code).to.contain('render() {')
    expect(code).to.contain('<h1>Hello World!</h1>')
  }
}
