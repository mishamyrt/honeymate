'use strict'
const puppeteer = require('puppeteer')

class Page {
    async init (filename) {
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
        // The size of the viewport like an iPhone X
        this.page.setViewport({
            width: 375,
            height: 635,
        })
        await this.page.goto(
            `http://127.0.0.1:1337/test/files/${filename}.html`,
            { waitUntil: 'load' }
        )
        await this.page.waitForSelector('.honey_ready')
    }

    async initManual (selector) {
        await this.page.evaluate(
            `const honeyNode = Honeymate.generateNode(
                document.querySelector('${selector}')
            )`
        )
    }

    async die () {
        await this.browser.close()
    }

    async findOne (selector) {
        return await this.page.$$(selector)[0]
    }

    async find (selector) {
        return await this.page.$$(selector)
    }
}

module.exports = Page
