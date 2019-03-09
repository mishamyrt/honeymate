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
            { waitUntil: 'networkidle0' }
        )
        await this.page.waitForSelector('.honey_ready')
    }

    async initManual (selector) {
        await this.page.evaluate(
            `Honeymate.generateNode(
                document.querySelector('${selector}')
            )`
        )
    }

    async getStyle (selector, property) {
        return await this.page.evaluate(({ selector, property }) => {
            const node = document.querySelector(selector)
            return node.style[property]
        }, { selector, property })
    }

    async die () {
        await this.browser.close()
    }

    async findOne (selector) {
        return await this.page.$(selector)
    }

    async find (selector) {
        return await this.page.$$(selector)
    }
}

module.exports = Page
