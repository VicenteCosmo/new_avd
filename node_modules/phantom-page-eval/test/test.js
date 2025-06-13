'use strict'

const should = require('should')
const path = require('path')
const phantomPath = require('phantomjs-prebuilt').path
const phantomPageEval = require('../')

const sampleHtmlPath = path.join(__dirname, 'sample.html')

describe('phantom-page-eval', () => {
  let phantomEval

  beforeEach(() => {
    phantomEval = phantomPageEval({ phantomPath })
  })

  it('should fail when no phantomPath is specified', () => {
    should(() => {
      phantomPageEval()
    }).throw()
  })

  it('should fail when required options are not specified', async () => {
    return should(
      phantomEval()
    ).be.rejected()
  })

  it('should fail with invalid script', async () => {
    return should(
      phantomEval({
        html: sampleHtmlPath,
        scriptFn: `1 + 2`
      })
    ).be.rejected()
  })

  it('should eval simple script', async () => {
    const result = await phantomEval({
      html: sampleHtmlPath,
      scriptFn: 'function () { return 1 + 2 }'
    })

    should(result).be.eql(3)
  })

  it('should eval script that uses DOM', async () => {
    const result = await phantomEval({
      html: sampleHtmlPath,
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

    should(result).be.Object()
    should(result.title).be.eql('Test page')
    should(result.content).have.length(4)
  })

  it('should allow inserting styles at the beginning of page', async () => {
    const result = await phantomEval({
      html: sampleHtmlPath,
      styles: [`
        * {
          font-family: Calibri
        }
        .extra {
          font-family: "Times New Roman"
        }
      `],
      scriptFn: `
        function () {
          var title = document.title
          var contentNodes = Array.prototype.slice.call(document.getElementsByClassName('content'))

          var contentFontFamily = document.defaultView.getComputedStyle(contentNodes[0], null).getPropertyValue('font-family')
          var extraFontFamily = document.defaultView.getComputedStyle(document.querySelector('.extra'), null).getPropertyValue('font-family')

          var content = contentNodes.map(function (node) {
            return node.textContent
          })

          return {
            title: title,
            content: content,
            contentFontFamily: contentFontFamily,
            extraFontFamily: extraFontFamily
          }
        }
      `
    })

    should(result).be.Object()
    should(result.title).be.eql('Test page')
    should(result.contentFontFamily).be.eql('Calibri')
    should(result.extraFontFamily).be.eql(`'Times New Roman'`)
  })

  it('should wait for JS trigger to start to eval', async () => {
    const result = await phantomEval({
      html: path.join(__dirname, 'sampleJSTrigger.html'),
      waitForJS: true,
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

    should(result).be.Object()
    should(result.title).be.eql('Test page')
    should(result.content).have.length(5)
  })

  it('should wait for JS trigger to start to eval (custom var name)', async () => {
    const result = await phantomEval({
      html: path.join(__dirname, 'sampleJSTrigger2.html'),
      waitForJS: true,
      waitForJSVarName: 'READY_TO_START',
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

    should(result).be.Object()
    should(result.title).be.eql('Test page')
    should(result.content).have.length(5)
  })

  it('should pass custom args to script', async () => {
    const result = await phantomEval({
      html: sampleHtmlPath,
      args: [1, 2],
      scriptFn: `
        function (x, y) {
          return x + y
        }
      `
    })

    should(result).be.eql(3)
  })

  it('should timeout with blocking script', async () => {
    return should(
      phantomEval({
        html: sampleHtmlPath,
        timeout: 1500,
        scriptFn: `
          function () {
            while (true) {

            }

            return 'test'
          }
        `
      })
    ).be.rejectedWith(/Timeout/)
  })
})
