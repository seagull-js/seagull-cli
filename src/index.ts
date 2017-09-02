#!/usr/bin/env node
/**
 * App structure:
 * - package.json (with main: file which exports 'app')
 * - index.ts (main file as above)
 * - hidden folder '.build' -> where the magic happens
 * - 'lib' -> general utility logic, modules with unit tests
 * - 'api' -> backend routes, modules with functional tests
 * - 'test' -> where the test files reside
 */

/**
  * Workflow(s):
  *
  * // create new app
  * - `seagull new 'example_app'`
  * - `cd example_app`
  *
  * // create backend action (with functional tests)
  * - seagull add:api hello/world
  *
  * // run a local dev server
  * - seagull serve [--port 3000]
  *
  * // run the test suites (unit, functional, integration)
  * - seagull test / test:unit / test:functional / test:integration
  *
  */

import { CLI, Shim } from 'clime'
import * as Path from 'path'

// The second parameter is the path to folder that contains command modules.
const cli = new CLI('seagull', Path.join(__dirname, 'commands'))

// Clime in its core provides an object-based command-line infrastructure.
// To have it work as a common CLI, a shim needs to be applied:
const shim = new Shim(cli)
shim.execute(process.argv)
