import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { Base } from '../../../lib/codegen'

@suite
class CodegenBaseTest {
  @test
  'can be initialized'() {
    const gen = new Base()
    expect(gen).to.be.an('object')
  }

  @test
  'can add default import to file'() {
    const gen = new Base()
    gen.addDefaultImport('moduleName', 'Mod')
    const code = gen.toString()
    expect(code).to.contain(`import Mod from 'moduleName'`)
  }

  @test
  'can add legacy import to file'() {
    const gen = new Base()
    gen.addDefaultImport('moduleName', 'Mod', true)
    const code = gen.toString()
    expect(code).to.contain(`import * as Mod from 'moduleName'`)
  }

  @test
  'can add named imports to file'() {
    const gen = new Base()
    gen.addNamedImports('mod', ['a', 'b'])
    const code = gen.toString()
    expect(code).to.contain(`import { a, b } from 'mod'`)
  }
}
