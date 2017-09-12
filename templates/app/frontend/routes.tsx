// library imports
import { history } from '@seagull-js/seagull'
import createElement from 'inferno-create-element';
import { Provider } from 'inferno-mobx'
import { Route, Router } from 'inferno-router';

// import of individual pages
import HelloPage from './pages/hello'

// routing structure
const routes = (
  <Provider>
    <Router history={ history }>
      <Route path='/' component={ HelloPage }/>
    </Router>
  </Provider>
)

export default routes