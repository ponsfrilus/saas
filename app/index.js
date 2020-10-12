const { URL }   = require('url')
const express   = require('express')
const app       = express()
const port      = process.env.PORT || 3210
const fs        = require('fs')
const path      = require('path')
const tld       = require('tld-extract')
const puppeteer = require('puppeteer')
const dataDir   = '../data'

/**
 * This provide a response to browsers self requests on the favicon
 * https://stackoverflow.com/a/33062403/960623
 */
const favicon = new Buffer.from('AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcAAAAA/wAAAP/2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcAAAAA/wAAAP8AAAD/AAAA//YhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAAAAAP8AAAD/AAAA/wAAAP/2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcAAAAA/wAAAP/2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA9iFXAPYhVwD2IVcA//8AAP//AAD//wAA//8AAP//AAD//wAA/n8AAPw/AAD8PwAA/n8AAP//AAD//wAA//8AAP//AAD//wAA//8AAA==', 'base64') 
app.get("/favicon.ico", function(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Length', favicon.length)
  res.setHeader('Content-Type', 'image/x-icon')
  res.setHeader('Cache-Control', 'public, max-age=2592000') // expiers after a month
  res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString())
  res.end(favicon)
})

/**
 * Home page
 */
app.get('/', async (req, res) => {
  const title = '<h3>SaaS — Screenshot as a Service</h3>'
  const testImage = '<p><img src="http://localhost:3210/https://www.epfl.ch/en/" /></p>'
  res.send(title + testImage)
})

/**
 * Comfort: make requests on http://saas:3210/https://www.epfl.ch work
 * Note: it won't work if the site has a query string
 */
app.get(/^\/((www|http:|https:)+[^\s]+[\w])/g, async (req, res) => {
  const url = validateURL(req.params[0])
  await screenshot(url)
  res.sendFile(path.resolve(`${dataDir}/${url.path}/${url.file}.png`))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const validateURL = (vurl) => {
  const url = new URL(vurl)
  const urlInfo = tld(url.toString())
  var trimmedDomain = urlInfo.domain.replace("." + urlInfo.tld,"")
  fileName = `${url.hostname}${url.pathname}`.replace(/\/+$/, "").replace(/\//g, "_")
  // console.debug("Save path for", vurl, "is", `${dataDir}/${urlInfo.tld}/${trimmedDomain}/${urlInfo.sub}/${fileName}.png`)
  return { url, path: `${urlInfo.tld}/${trimmedDomain}/${urlInfo.sub}`, file: fileName}
}

const screenshot = async (url) => {
  const browser = await puppeteer.launch({args: [`--window-size=${1200},${900}`, '--no-sandbox'], defaultViewport: null})
  const page = await browser.newPage()

  console.log(`Screenshoting ${url.url.href}`)

  await page.goto(url.url.href, { waitUntil: 'networkidle2' }) // .catch(e => void 0)

  // remove the cookie consent from the screenshot
  await page.evaluate(() => {
    var element = document.querySelector('.cc-window')
    if (element) {
      element.parentNode.removeChild(element)
    }
  })

  // ensure the path exsists
  fs.mkdir(`${dataDir}/${url.path}`, { recursive: true }, (err) => {
    if (err) throw err
  })

  console.log(" ↳ screenshot path", `${dataDir}/${url.path}/${url.file}.png`)
  await page.screenshot({path: `${dataDir}/${url.path}/${url.file}.png`, /*fullPage: true*/})
  // PDF ? → await page.pdf({path: '${dataDir}/hn.pdf', format: 'A4'})

  await browser.close()
}
