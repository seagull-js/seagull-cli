import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import IntegrationTest from '../helper/integration_test'

@suite('Loader::app')
class LoaderAppTest extends IntegrationTest {
  @test
  'can build and serve an new empty app'() {
    this.build()
    const server = this.serve()
    server.close()
  }
}
