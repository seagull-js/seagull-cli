import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generatePackageJson } from '../../../lib/codegen'

@suite
class CodegenPackageJsonTest {
  @test
  'can be initialized'() {
    const gen = generatePackageJson('demo')
    expect(gen).to.be.an('object')
  }

  @test
  'name gets passed into file'() {
    const gen = generatePackageJson('demo')
    const code = gen.toString()
    expect(code).to.contain(`"name": "demo"`)
  }
}
