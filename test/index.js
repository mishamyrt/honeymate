'use strict'

const {
    before,
    beforeEach,
    afterEach,
    describe,
    it,
} = require('mocha')

const startServer = require('./utils/start-server')
const { expect } = require('chai').use(require('chai-as-promised'))
const Page = require('./utils/page')

const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

describe('Honeymate', () => {
    let page

    before(async () => {
        await startServer()
    })

    beforeEach(() => {
        page = new Page()
    })

    afterEach(async () => {
        await page.die()
    })

    describe('initialization', () => {
        beforeEach(async () => {
            await page.init('initialization')
        })

        it('should initialize automatically', async () => {
            const allHoneyNodes = await page.find('.honey')
            const readyNodes = await page.find('.honey_ready')
            expect(readyNodes.length).to.equals(allHoneyNodes.length)
        })

        it('should initialize manually', async () => {
            await page.initManual('.nohoney')
            const readyNodes = await page.find('.honey_ready')
            const manualNodes = await page.find('.nohoney')
            const autoNodes = await page.find('.honey')
            expect(readyNodes.length).to.equals(manualNodes.length + autoNodes.length)
        })
    })

    describe('display', () => {
        beforeEach(async () => {
            await page.init('expose')
            await sleep(100)
        })

        it('should display block on images load', async () => {
            expect(
                await page.isExposed('.images_right')
            ).to.equal(true)
        })

        it('should display block on images error', async () => {
            expect(
                await page.isExposed('.images_wrong')
            ).to.equal(true)
        })

        it('should display block on mixed load', async () => {
            expect(
                await page.isExposed('.images_mixed')
            ).to.equal(true)
        })
    })

    describe('await', () => {
        beforeEach(async () => {
            await page.init('order')
        })

        it('should be hidden first', async () => {
            return expect(
                await page.isExposed('.awaiter')
            ).to.equal(false)
        })

        it('should be exposed after pending node', async () => {
            await sleep(600)
            return expect(
                await page.isExposed('.awaiter')
            ).to.equal(true)
        })
    })
})
