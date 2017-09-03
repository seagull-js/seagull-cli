# Test Helpers

These functions here are NOT executed during tests, but provide common
functionality used within the test suites.

## class UnitTest

These tests do not require the physical presence of an actual seagull project
and can run in full isolation. These tests are also the fastest of them all.

## class FunctionalTest

These tests require the physical presence of a seagull project to run. Before
the suit is run, an example project will be generated and the current working
directory (cwd) will be changed into the project's root directory.

## class IntegrationTest

Similar to FunctionalTest, but creates a fresh example project before each
individual test run within the suite.