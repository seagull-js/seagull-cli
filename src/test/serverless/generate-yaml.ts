import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'

import App from 'seagull'
import generate from '../../lib/serverless/generate-yaml'

@suite()
class ServerlessYaml {
  @test('can generate a serverless.yml in memory')
  canGenerateYamlInMemory() {
    const app = { backend: [], name: 'MyApp' }
    const yml = generate(app)
    // tslint:disable-next-line:no-console
    // console.log(yml)
    expect(yml).to.include('aws')
    expect(yml).to.include('runtime: nodejs6.10')
  }
}
