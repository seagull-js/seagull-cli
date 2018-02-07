import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generateTsconfigJson } from '../../../lib/codegen'

@suite
class CodegenTsconfigJsonTest {
  @test
  'can be initialized'() {
    const gen = generateTsconfigJson()
    expect(gen).to.be.an('object')
  }

  @test
  'react is enabled for frontend code'() {
    const gen = generateTsconfigJson()
    const code = gen.toString()
    expect(code).to.contain(`"jsx": "react"`)
  }

  @test
  'outfolder is hardcoded for serverless deployment'() {
    const gen = generateTsconfigJson()
    const code = gen.toString()
    expect(code).to.contain(`"outDir": "./.seagull/dist"`)
  }

  @test
  'decorators are enabled fully for backend models'() {
    const gen = generateTsconfigJson()
    const code = gen.toString()
    expect(code).to.contain(`"experimentalDecorators": true`)
    expect(code).to.contain(`"emitDecoratorMetadata": true,`)
  }

  @test
  'modern transpilation with sourcemaps are enabled for better debugging'() {
    const gen = generateTsconfigJson()
    const code = gen.toString()
    expect(code).to.contain(`"target": "es6"`)
    expect(code).to.contain(`"sourceMap": true`)
  }
}
