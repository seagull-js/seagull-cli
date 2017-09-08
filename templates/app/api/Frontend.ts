// library imports
import { API, Request, Response } from '@seagull-js/seagull'
import createElement from 'inferno-create-element'
import { doAllAsyncBefore, match, RouterContext } from 'inferno-router'
import { renderToString } from 'inferno-server'

// configuration imports
import layout from '../frontend/layout'
import routes from '../frontend/routes'

// Server Side Rendering for the frontend
export default class Frontend extends API {
  static method = 'GET'
  static path = '/*'
  async handle(request: Request): Promise<Response> {
    const renderProps = match(routes, request.path)
    // TODO
    // if (renderProps.redirect) {
    //   return this.redirect(renderProps.redirect)
    // }
    const children = createElement(RouterContext, renderProps)
    const body = renderToString(layout({ children }))
    return this.html('<!DOCTYPE html>\n' + body)
  }
}