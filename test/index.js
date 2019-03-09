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
        })

        it('should display block on images load', async () => {
            const style = await page.getStyle('.honey.images_right', 'opacity')
            expect(style).to.equals('1')
        })

        it('should display block on images error', async () => {
            const style = await page.getStyle('.honey.images_wrong', 'opacity')
            expect(style).to.equals('1')
        })
    })
})
