// library imports
import { history } from '@seagull-js/seagull'
import createElement from 'inferno-create-element';
import { Route, Router } from 'inferno-router';

// import of individual pages
import HelloPage from './pages/hello'

// routing structure
const routes = (
  <Router history={ history }>
    <Route path='/' component={ HelloPage }/>
  </Router>
)

export default routes