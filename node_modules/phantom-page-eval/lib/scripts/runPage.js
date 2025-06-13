
/* start logScript part */
var MAX_LOG_ENTRY_SIZE = 1000

var messages = []

function trimMessage (pars) {
  var message = Array.prototype.join.call(pars, ' ')

  // this is special case, because phantom logs base64 images content completely into the output
  if (message.indexOf('Request data:image') === 0 && message.length > 100) {
    return message.substring(0, 100) + '...'
  }

  if (message.length > MAX_LOG_ENTRY_SIZE) {
    return message.substring(0, MAX_LOG_ENTRY_SIZE) + '...'
  }

  return message
}

console.log = function (m) {
  var lastArg = arguments[arguments.length - 1]
  var log = { timestamp: new Date().getTime(), message: trimMessage(arguments), level: 'debug' }

  if (
    lastArg != null &&
    typeof lastArg === 'object' &&
    !Array.isArray(lastArg) &&
    Object.prototype.hasOwnProperty.call(lastArg, 'userLevel')
  ) {
    log.userLevel = lastArg.userLevel === true
  }

  messages.push(log)
}

console.error = function (m) {
  var lastArg = arguments[arguments.length - 1]
  var log = { timestamp: new Date().getTime(), message: trimMessage(arguments), level: 'error' }

  if (
    lastArg != null &&
    typeof lastArg === 'object' &&
    !Array.isArray(lastArg) &&
    Object.prototype.hasOwnProperty.call(lastArg, 'userLevel')
  ) {
    log.userLevel = lastArg.userLevel === true
  }

  messages.push(log)
}

console.warn = function (m) {
  var lastArg = arguments[arguments.length - 1]
  var log = { timestamp: new Date().getTime(), message: trimMessage(arguments), level: 'warn' }

  if (
    lastArg != null &&
    typeof lastArg === 'object' &&
    !Array.isArray(lastArg) &&
    Object.prototype.hasOwnProperty.call(lastArg, 'userLevel')
  ) {
    log.userLevel = lastArg.userLevel === true
  }

  messages.push(log)
}
/* end logScript part */

try {
  /* eslint-disable-next-line no-undef */
  console.log('evaluating in phantomjs version: ' + phantom.version.major + '.' + phantom.version.minor + '.' + phantom.version.patch)

  var webpage = require('webpage')
  var system = require('system')
  var fs = require('fs')
  var page = webpage.create()
  var settingsFile = system.args[system.args.length - 1]
  var stream = fs.open(settingsFile, 'r')
  var body = JSON.parse(stream.read())

  stream.close()

  // eslint-disable-next-line no-inner-declarations
  function respond (page, response) {
    system.stdout.write(JSON.stringify(response))

    // Work-around to avoid "Unsafe JavaScript attempt to access frame" warning in PhantomJS 1.9.8.
    // See: https://github.com/ariya/phantomjs/issues/12697
    // since we rely on stdout for the dedicated-process strategy this work-around
    // ensures the phantom process don't log anything we don't want
    page.close()

    setTimeout(function () {
      /* eslint-disable-next-line no-undef */
      phantom.exit(0)
    }, 0)
  }

  // eslint-disable-next-line no-unneeded-ternary
  var pageJSisDone = body.waitForJS ? false : true

  /* start conversion script part */
  page.viewportSize = {
    width: body.viewport.width,
    height: body.viewport.height
  }

  page.settings.javascriptEnabled = true

  page.onResourceRequested = function (request, networkRequest) {
    console.log('Request ' + request.url)

    if (request.url.lastIndexOf(body.url, 0) === 0) {
      return
    }

    // potentially dangerous request
    if (request.url.lastIndexOf('file:///', 0) === 0) {
      networkRequest.abort()
      return
    }

    // to support cdn like format //cdn.jquery...
    if (request.url.lastIndexOf('file://', 0) === 0 && request.url.lastIndexOf('file:///', 0) !== 0) {
      networkRequest.changeUrl(request.url.replace('file://', 'http://'))
    }

    if (body.waitForJS === true && request.url.lastIndexOf('http://intruct-javascript-ending', 0) === 0) {
      pageJSisDone = true
    }
  }

  page.onConsoleMessage = function (msg, line, source) {
    console.log(msg, line, source, { userLevel: true })
  }

  page.onResourceError = function (resourceError) {
    console.warn('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')')
    console.warn('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString)
  }

  page.onError = function (msg, trace) {
    console.warn(msg)

    trace.forEach(function (item) {
      console.warn('  ', item.file, ':', item.line)
    })
  }

  page.onInitialized = function () {
    if (body.waitForJS === true) {
      page.evaluate(function (varName) {
        if (typeof Object.defineProperty === 'function') {
          // eslint-disable-next-line accessor-pairs
          Object.defineProperty(window, varName, {
            set: function (val) {
              if (!val) {
                return
              }

              if (val === true) {
                var scriptNode = document.createElement('script')
                scriptNode.src = 'http://intruct-javascript-ending'
                document.body.appendChild(scriptNode)
              }
            }
          })
        }
      }, body.waitForJSVarName)
    }
  }

  page.open(body.url, function () {
    page.zoomFactor = 1

    if (body.styles.length > 0) {
      console.log('adding custom styles at the beginning of page..')

      page.evaluate(function (styles) {
        var fragment = document.createDocumentFragment()

        styles.forEach(function (css) {
          var styleNode = document.createElement('style')
          styleNode.appendChild(document.createTextNode(css))
          fragment.appendChild(styleNode)
        })

        document.head.insertBefore(fragment, document.head.firstChild)
      }, body.styles)
    }

    setTimeout(function () {
      resolvePage()
    }, 0)

    // eslint-disable-next-line no-inner-declarations
    function resolvePage () {
      try {
        if (body.waitForJS === true && !pageJSisDone) {
          setTimeout(function () {
            resolvePage()
          }, 100)

          return
        }

        var resultData = page.evaluate(function (rawFnSource, customArgs) {
          var fnSource = rawFnSource.trim()

          fnSource = fnSource.slice(-1) === ';' ? fnSource.slice(0, -1) : fnSource

          var fn = '(function result() { '
          fn += 'return (' + fnSource + ') '
          fn += '})()'

          try {
            // eslint-disable-next-line
            fn = window.eval(fn)
          } catch (e) {
            // eslint-disable-next-line no-template-curly-in-string
            return {
              error: 'script code passed as `scriptFn` option has syntax error: ' + e.message
            }
          }

          if (typeof fn !== 'function') {
            return {
              error: 'script code passed as `scriptFn` option is not a function'
            }
          }

          return {
            result: fn.apply(null, customArgs)
          }
        }, body.scriptFn, body.args)

        // resultData can still be null if evaluated script returned
        // non-serializable value
        if (resultData && resultData.error) {
          throw new Error(resultData.error)
        }

        fs.write(body.outputFilePath, JSON.stringify({
          result: resultData != null ? resultData.result : undefined
        }), 'w')

        respond(page, {
          empty: resultData == null,
          logs: messages
        })
      } catch (e) {
        onMainError(e)
      }
    }
  })
  /* end conversion script part */
} catch (e) {
  onMainError(e)
}

function onMainError (e) {
  console.error(e.message)
  e.message += '; log: ' + JSON.stringify(messages)
  system.stderr.write(JSON.stringify(e))

  /* eslint-disable-next-line no-undef */
  phantom.exit(1)
}
