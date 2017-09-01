import { API, Request, Response } from 'seagull'

export default class APINAME extends API {
  /**
   * This is the HTTP method / verb for the API. Defaults to 'GET'
   */
  method = 'GET'

  /**
   * The URL path where this API will be located. Skip for private functions
   * like cronjobs. Example: '/greetings/{name}'
   */
  // path = '/'

  /**
   * This handle function executes your code. Return one of the following method
   * invocations: 'text', 'json', 'redirect', 'missing', 'error'
   */
  async handle(request: Request): Promise<Response> {
    return this.text('hello world')
  }
}