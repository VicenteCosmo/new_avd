# phantom-page-eval
[![NPM Version](http://img.shields.io/npm/v/phantom-page-eval.svg?style=flat-square)](https://npmjs.com/package/phantom-page-eval)
[![License](http://img.shields.io/npm/l/phantom-page-eval.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/bjrmatos/phantom-page-eval.png?branch=master)](https://travis-ci.org/bjrmatos/phantom-page-eval)

> **Evaluate a script function on a page with PhantomJS**

This module let you evaluate a script function on a page using [PhantomJS](http://phantomjs.org/) and get the return value of the evaluation in node.

## Usage
```html
<!-- sample.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test page</title>
</head>
<body>
  <div class="content">1</div>
  <div class="content">2</div>
  <div class="content">3</div>
  <div class="content">4</div>
</body>
</html>
```

```js
const phantomPath = require('phantomjs').path
const phantomPageEval = require('phantom-page-eval')
const phantomEval = phantomPageEval({ phantomPath })

(async () => {
  try {
    const result = await phantomEval({
      html: '/path/to/sample.html',
      scriptFn: `
        function () {
          var title = document.title
          var content = Array.prototype.slice.call(document.getElementsByClassName('content'))

          content = content.map(function (node) {
            return node.textContent
          })

          return {
            title: title,
            content: content
          }
        }
      `
    })

    console.log(result.title) // -> Test page
    console.log(result.content) // -> [1, 2, 3, 4]
  } catch (e) {
    console.error('Error while trying to evaluate script:', e)
  }
})()
```

## Constructor options

```js
const phantomPageEval = require('phantom-page-eval')
const phantomEval = phantomPageEval({ /*[constructor options here]*/ })
```

- `phantomPath` **string** **[required]** - the path to the [phantomjs](http://phantomjs.org/) executable that your app is going to use
- `tmpDir` **string** - the directory path that the module is going to use to save temporary files needed during the evaluation. defaults to [`require('os').tmpdir()`](https://nodejs.org/dist/latest-v8.x/docs/api/os.html#os_os_tmpdir)
- `clean` **boolean** - specifies if the module should delete any temp file automatically after an evaluation, if `false` temp files will not be cleaned by the module and app developer will be responsible to clean them. defaults to `true`
- `launchArgs` **array** - array with [any of the command line options supported by phantomjs](http://phantomjs.org/api/command-line.html#command-line-options). defaults to `['--ignore-ssl-errors=yes', '--web-security=false', '--ssl-protocol=any']`

## Evaluate options

```js
const phantomPath = require('phantomjs').path
const phantomPageEval = require('phantom-page-eval')
const phantomEval = phantomPageEval({ phantomPath })

(async () => {
  const result = await phantomEval({ /*[evaluate options here]*/ })
})()
```

- `html` **string** **[required]** - the path to the html file to load in a phantom page
- `scriptFn` **string** **[required]** - the script to evaluate in the phantom page. the script must be a function that returns a value. ex: `scriptFn: 'function () { return 1 + 2}'`
- `styles` **array<string>** - array of css strings to insert at the beginning of page's head element. ex: `styles: ['* { font-family: 'Calibri'; font-size: 16px; }']`
- `waitForJS` **boolean** - when `true` the `scriptFn` won't be executed until the variable specified in `waitForJSVarName` option is set to true in page's javscript. defaults to `false`
- `waitForJSVarName` **string** - name of the variable that will be used as trigger of `scriptFn`. defaults to `"PHANTOM_PAGE_EVAL_READY"`
- `viewport` **object** - object with [any of the viewportSize options supported by phantomjs](http://phantomjs.org/api/webpage/property/viewport-size.html)
- `args` **array** - a list of custom arguments to pass to the `scriptFn` function. ex: `args: [1, 2]` and with `scriptFn: function (a, b) { return a + b}'` will produce `3` as result
- `timeout` **number** - time in ms to wait for the script evaluation to complete, when the timeout is reached the evaluation is cancelled. defaults to `30000`

## Requirements

- Have available a phantomjs executable. you can download phantomjs and get access to the path to the executable by doing: `npm install phantomjs --save` or `npm install phantomjs-prebuilt --save` and then in your project call `require('phantomjs').path` and pass it to `phantom-page-eval` constructor function.

## Caveats

- What you return in your script function (`scriptFn` option) must be a [serializable value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description) recognized by phantomjs in order to receive it properly (normal javascript primitives like object, arrays, string, booleans, etc are good), if a non serializable value is returned you will get `undefined` as the result.

## Debugging

- To get more information (internal debugging logs of the module) about what's happening during the evaluation on the page start your app in this way: `DEBUG=phantom-page-eval* node [your-entry-file-here].js` (on Windows use `set DEBUG=phantom-page-eval* && node [your-entry-file-here].js`). This will print out to the console some additional information about what's going on.

## License
See [license](https://github.com/bjrmatos/chrome-page-eval/blob/master/LICENSE)
