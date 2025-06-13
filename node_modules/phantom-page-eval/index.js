'use strict'

const os = require('os')
const pkg = require('./package.json')
const debugMe = require('debug')(pkg.name)
const evalImplementation = require('./lib/eval')

const defaultLaunchArgs = [
  '--ignore-ssl-errors=yes',
  '--web-security=false',
  '--ssl-protocol=any'
]

module.exports = (options) => {
  const { phantomPath, ...rest } = options

  if (!phantomPath) {
    throw new Error('required `phantomPath` option not specified, make sure to install phantomJS and pass the path to the constructor')
  }

  if (!rest.tmpDir) {
    rest.tmpDir = os.tmpdir()
  }

  if (!Array.isArray(rest.launchArgs)) {
    rest.launchArgs = [...defaultLaunchArgs]
  }

  rest.clean = options.clean == null ? true : options.clean

  debugMe('Creating a new evaluate function with options:', rest)

  return evalImplementation(phantomPath, rest)
}
