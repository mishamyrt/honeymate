'use strict'

const {
    before,
    after,
    describe,
    it,
} = require('mocha')
const selenium = require('selenium-webdriver')
const startServer = require('./utils/startServer')
const expect = require('chai').use(require('chai-as-promised')).expect
require('chromedriver')
const until = require('selenium-webdriver/lib/until')

const getPage = (driver, pageName) => {
    return driver.get('http://127.0.0.1:1337/test/files/' + pageName + '.html')
}

const waitUntilHoneymateInitialized = (driver) => {
    return driver.wait(until.elementLocated({ css: '.honey_ready' }), 1500)
}

describe('Honeymate', () => {
    let driver

    before(() => {
        driver = new selenium.Builder()
            .forBrowser('chrome')
            .build()

        startServer()
    })

    after(() => {
        return driver.quit()
    })

    describe('initialization', () => {
        it('should initialize automatically', () => {
            getPage(driver, 'initialization')
            return waitUntilHoneymateInitialized(driver)
                .then(() => driver.findElements({ css: '.honey' }))
                .then((allHoneyNodes) => {
                    return expect(driver.findElements({ css: '.honey_ready' })).to.eventually.have.lengthOf(allHoneyNodes.length)
                })
        })

        it('should initialize manually', () => {
            getPage(driver, 'manual-initialization')
            return driver.executeScript(
                `const honeyNode = Honeymate.generateNode(
                    document.querySelector('.nohoney')
                )`
            )
                .then(() => waitUntilHoneymateInitialized(driver))
                .then(() => driver.findElements({ css: '.nohoney' }))
                .then((allHoneyNodes) => {
                    return expect(driver.findElements({ css: '.honey_ready' })).to.eventually.have.lengthOf(allHoneyNodes.length)
                })
        })
    })
})
