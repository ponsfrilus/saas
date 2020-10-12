# SaaS - Screenshot as a Service

This is a screenshot as a service container written in node.js using [express](https://expressjs.com/) and [puppeteer](https://github.com/puppeteer/puppeteer).


## Usage

  1. `docker-compose up`
  2. [http://localhost:3210/https://www.epfl.ch](http://localhost:3210/https://www.epfl.ch)
  3. or `<img src="http://localhost:3210/https://www.epfl.ch" />`


## Todo

  - [ ] Allow URL with query string (e.g. https://news.ycombinator.com/item?id=24753564)
  - [ ] Allow to choose between PNG (default), JPG or PDF
  - [ ] Allow to choose screenshot width and height (default width=1200, height=900)
  - [ ] Allow to choose a full page screenshot
  - [ ] Allow to choose to keep cookie consent
  - [ ] Add cache (as env var) and a parameter to bypass cache
  - [ ] Is it possible to take webpage screenshot that includes background video (https://stackoverflow.com/questions/59901436/how-to-use-puppeteer-to-take-screenshots-of-pages-that-contain-video / https://github.com/puppeteer/puppeteer/issues/291) ?
  - [ ] Fake image loader
    - [ ] Read more about progressive image loading, e.g. https://medium.com/@jmperezperez/more-examples-of-progressive-image-loading-f258be9f440b
    - [ ] Use http-multipart-x-mixed-replace ?
