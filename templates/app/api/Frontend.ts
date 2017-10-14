// library imports
import { API, Request, Response } from '@seagull-js/seagull'
import { renderToString as render } from 'react-dom/server';

// configuration imports
import layout from '../frontend/layout'
import routes from '../frontend/routes'

// Server Side Rendering for the frontend
export default class Frontend extends API {
  static method = 'GET'
  static path = '/*'
  async handle(request: Request): Promise<Response> {
    return this.html(render(layout({ children: routes(true, request) })))
  }
}