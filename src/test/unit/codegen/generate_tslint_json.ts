import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generateTslintJson } from '../../../lib/codegen'

@suite
class CodegenTslintJsonTest {
  @test
  'can be initialized'() {
    const gen = generateTslintJson()
    expect(gen).to.be.an('object')
  }
}
