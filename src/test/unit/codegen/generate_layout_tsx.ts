import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generateLayoutTsx } from '../../../lib/codegen'

@suite
class CodegenGenerateLayoutTsxTest {
  @test
  'can be initialized'() {
    const gen = generateLayoutTsx()
    expect(gen).to.be.an('object')
  }

  @test
  'begins with correct react import'() {
    const gen = generateLayoutTsx()
    const code = gen.toString()
    expect(code).to.contain(`import * as React from 'react'`)
  }

  @test
  'contains props-children param'() {
    const gen = generateLayoutTsx()
    const code = gen.toString()
    expect(code).to.contain(`function Layout({ children }) {`)
  }

  @test
  'contains props-children insertion slot'() {
    const gen = generateLayoutTsx()
    const code = gen.toString()
    expect(code).to.contain(`<div id="root">{children}</div>`)
  }

  @test
  'contains script tag for frontend bundle'() {
    const gen = generateLayoutTsx()
    const code = gen.toString()
    expect(code).to.contain(`<script src="/assets/bundle.js" />`)
  }
}
