'use strict'

const path = require('path')
const util = require('util')
const fs = require('fs')
const childProcess = require('child_process')
const { nanoid } = require('nanoid')
const pkg = require('../package.json')
const debugMe = require('debug')(`${pkg.name}:eval`)

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
const unlinkAsync = util.promisify(fs.unlink)

module.exports = (phantomPath, options) => {
  const tmpDir = options.tmpDir
  const clean = options.clean
  const launchArgs = options.launchArgs

  return (
    async function evaluate ({
      html,
      scriptFn,
      viewport = {},
      styles = [],
      waitForJS = false,
      waitForJSVarName = 'PHANTOM_PAGE_EVAL_READY',
      args = [],
      timeout = 30000
    }) {
      const uid = nanoid(7)

      if (html == null) {
        throw new Error('required `html` option not specified')
      }

      if (scriptFn == null) {
        throw new Error('required `scriptFn` option not specified')
      }

      if (typeof timeout !== 'number') {
        throw new Error('`timeout` option must be a number')
      }

      if (viewport.width == null) {
        viewport.width = 600
      }

      if (viewport.height == null) {
        viewport.height = 600
      }

      if (!path.isAbsolute(html)) {
        throw new Error('`html` option must be an absolute path to a file')
      }

      const childArgs = [...launchArgs]
      const inputFilePath = path.join(tmpDir, `${uid}-eval-input.json`)
      const outputFilePath = path.join(tmpDir, `${uid}-eval-output.json`)

      debugMe(`temp files paths will be: input (${inputFilePath}), output: (${outputFilePath})`)

      const inputData = {
        url: 'file:///' + encodeURIComponent(html),
        scriptFn,
        styles,
        waitForJS,
        waitForJSVarName,
        args,
        viewport,
        outputFilePath
      }

      debugMe(`creating input file for inter-process communication with phantom with values:`, inputData)

      await writeFileAsync(inputFilePath, JSON.stringify(inputData))

      childArgs.push(path.join(__dirname, 'scripts/runPage.js'))
      childArgs.push(inputFilePath)

      debugMe(`launching new phantom process from ${phantomPath} with options:`, childArgs)

      return new Promise((resolve, reject) => {
        let isDone = false
        let stdoutData = ''
        let stdErrData = ''

        let child = childProcess.execFile(phantomPath, childArgs, {
          env: process.env
        }, (err, stdout, stderr) => {
          if (isDone) {
            return
          }

          if (err) {
            if (err.signal === 'SIGSEGV') {
              err.message = (
                `${err.message} , Segmentation fault error: if you are using macOS Sierra with phantomjs < 2 remember that ` +
                `phantomjs < 2 does not work there and has bugs (ariya/phantomjs/issues/14558), ` +
                `try to upgrade to phantom 2 if using macOS Sierra`
              )
            }

            return reject(err)
          }

          debugMe(`phantom process ended correctly, parsing response`)

          let responseData
          let resultData

          try {
            responseData = JSON.parse(stdoutData)

            debugMe(`response is: ${stdoutData}`)
          } catch (parseErr) {
            return reject(new Error(`Error while trying to parse the response of phantom process: ${parseErr.message}`))
          }

          debugMe(`reading and parsing result of scriptFn`)

          resolve(
            readFileAsync(outputFilePath).then((fileContent) => {
              let resultString = fileContent.toString()

              try {
                resultData = JSON.parse(resultString)
              } catch (parseErr) {
                throw new Error(`Error while trying to parse the output of scriptFn: ${parseErr.message}`)
              }

              debugMe('evaluation completed with result:', resultString)

              isDone = true

              return responseData.empty ? undefined : resultData.result
            })
          )
        })

        child.stdout.on('data', (d) => {
          if (d) {
            stdoutData += d
          }
        })

        child.stderr.on('data', (d) => {
          if (d) {
            stdErrData += d
          }
        })

        child.on('exit', (code, signal) => {
          debugMe(`phantom process was ended with code ${code} and signal ${signal}`)
        })

        child.on('error', (err) => {
          if (isDone) {
            return
          }

          isDone = true

          debugMe(`phantom process on error: ${err.message}`)

          reject(err)
        })

        setTimeout(() => {
          if (isDone) {
            return
          }

          isDone = true

          let msg = `Timeout Error: script evaluation not completed after ${timeout}ms.`

          if (stdoutData !== '') {
            msg += ` stdout (phantom): ${stdoutData}.`
          }

          if (stdErrData !== '') {
            msg += ` stderr (phantom): ${stdErrData}.`
          }

          const timeoutErr = new Error(msg)

          child.kill()

          reject(timeoutErr)
        }, timeout).unref()
      }).then((result) => {
        if (clean) {
          debugMe(`auto cleaning input (${inputFilePath}) and output (${outputFilePath}) temp files`)

          // does not matter if we get errors trying to remove the files
          return Promise.all([
            unlinkAsync(inputFilePath),
            unlinkAsync(outputFilePath)
          ]).then(() => result).catch(() => result)
        }

        return result
      }).catch((e) => {
        debugMe(`error while running: ${e.message}`)

        throw e
      })
    }
  )
}
