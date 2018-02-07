import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import { generateModel } from '../../../lib/codegen'

@suite
class CodegenGenerateModelTest {
  @test
  'can generate minimal Model'() {
    const gen = generateModel('MyModel', { fields: [] })
    const code = gen.toString()
    expect(code).to.contain(`import { field, Model } from '@seagull`)
    expect(code).to.contain('export default class MyModel extends Model {}')
  }

  @test
  'can generate Model with fields'() {
    const fields = [
      { name: 'done', type: 'boolean', initial: 'false' },
      { name: 'text', type: 'string', initial: `''` },
    ]
    const gen = generateModel('MyModel', { fields })
    const code = gen.toString()
    expect(code).to.contain(`import { field, Model } from '@seagull`)
    expect(code).to.contain('export default class MyModel extends Model {')
    expect(code).to.contain(`@field done: boolean = false`)
    expect(code).to.contain(`@field text: string = ''`)
  }
}
