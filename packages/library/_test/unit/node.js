'use strict'

const requireES = require('esm')(module)
const {
    describe,
    beforeEach,
    it,
} = require('mocha')
const expect = require('chai').expect

const {
    HoneyNode,
} = requireES('../../source/node.mjs')

describe('HoneyNode', () => {
    let honeyNode
    let node

    beforeEach(() => {
        node = document.createElement('div')
        node.style.background = 'url(/img/test.jpg)'
        node.dataset = {
            down: 100,
            effect: 'zoom',
        }
        honeyNode = new HoneyNode(node)
    })

    it('should create instance', () => {
        expect(honeyNode.node._uniqueId).equals(node._uniqueId)
    })

    it('should parse `data–` attributes', () => {
        expect(honeyNode.parameters).to.include({
            origin: 'bottom',
            offset: 100,
        })
    })

    it('should update effect on options update', () => {
        honeyNode.options = {
            up: 100,
            effect: 'slide',
        }
        expect(honeyNode.effect).eqls({
            transition: 'transform 640ms cubic-bezier(0,.9,.1,1), opacity 640ms ease-out',
            transform: 'translateY(-100px)',
            transformOrigin: 'bottom',
        })
    })

    it('should wait until images in node is loaded', (done) => {
        honeyNode.isLoaded().then(() => {
            expect(true).equals(true)
            done()
        })
    })

    it('should expose node', (done) => {
        honeyNode.expose()
        setTimeout(() => {
            expect(honeyNode.node.style.opacity).equals(1)
            done()
        }, 100)
    })
})
