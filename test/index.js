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
        it('should initialize automatically', async () => {
            await page.init('initialization')
            const allHoneyNodes = await page.find('.honey')
            const readyNodes = await page.find('.honey_ready')
            expect(readyNodes.length).to.equals(allHoneyNodes.length)
        })

        it('should initialize manually', async () => {
            await page.init('initialization')
            await page.initManual('.nohoney')
            const readyNodes = await page.find('.honey_ready')
            const manualNodes = await page.find('.nohoney')
            const autoNodes = await page.find('.honey')
            expect(readyNodes.length).to.equals(manualNodes.length + autoNodes.length)
        })
    })
})
