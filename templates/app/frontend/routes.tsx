// library imports
import { history, Request } from '@seagull-js/seagull'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import * as React from 'react'
import { Route, Router, RouterProps, StaticRouter, StaticRouterProps, Switch } from 'react-router';

// import of stores
const routingStore = new RouterStore();
const stores = {
  routing: routingStore,
}
const browserHistory = syncHistoryWithStore(history, routingStore);

// import of individual pages
import HelloPage from './pages/hello'

// routing structure
const routes = ( isSSR = false, request?: Request ) => {

  let RouterConf: {
    appRouter: typeof Router,
    routerProps: RouterProps
  } | {
    appRouter: typeof StaticRouter,
    routerProps: StaticRouterProps
  } = {
    appRouter: Router,
    routerProps: { history: browserHistory }
  }
  if (isSSR && request) {
    RouterConf = {
      appRouter: StaticRouter,
      routerProps: {
        context: {},
        location: request.path
      }
    }
  }
  return (
    <Provider { ...stores }>
      <RouterConf.appRouter {...RouterConf.routerProps}>
        <Switch>
          <Route path='/' component={ HelloPage }/>
        </Switch>
      </RouterConf.appRouter>
    </Provider>
  )
}
export default routes