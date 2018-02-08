import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generateComponentTsx } from '../../../lib/codegen'

@suite
class CodegenGenerateComponentTsxTest {
  @test
  'can be initialized'() {
    const gen = generateComponentTsx('MyDiv')
    expect(gen).to.be.an('object')
  }

  @test
  'begins with correct react import'() {
    const gen = generateComponentTsx('MyDiv')
    const code = gen.toString()
    expect(code).to.contain(`import * as React from 'react'`)
  }

  @test
  'contains props-children param'() {
    const gen = generateComponentTsx('MyDiv')
    const code = gen.toString()
    // tslint:disable-next-line:no-console
    console.log(code)
    expect(code).to.contain(`function MyDiv({ children }) {`)
  }
}
