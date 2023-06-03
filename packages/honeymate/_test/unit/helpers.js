'use strict'

const requireES = require('esm')(module)
const {
    describe,
    it,
} = require('mocha')
const expect = require('chai').expect

const {
    getDirection,
    parseParameters,
    applyStyle,
    getSpinner,
} = requireES('../../source/helpers.mjs')

const spinnerSVG = '<svg width="32" height="32" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="#F00" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>'

describe('Helper functions', () => {
    it('should translate transition direction', () => {
        return expect(getDirection({
            down: 10,
        })).equal(3)
    })

    it('should parse dataset', () => {
        return expect(parseParameters({
            hold: '10',
            right: '10',
            spinSize: '10',
        })).eql({
            direction: 2,
            duration: 640,
            effect: '',
            expose: false,
            delay: 0,
            hold: 10,
            scale: '.87',
            await: null,
            origin: 'bottom',
            offset: '10',
            spin: false,
            spinColor: '#000',
            spinSize: 24,
            'continue': false,
        })
    })

    it('should apply styles to node', async () => {
        const transformString = 'translateY(10px)'
        const node = await applyStyle({
            style: {
                opacity: 0,
                transform: '',
            },
        }, {
            opacity: 1,
            transform: transformString,
        })

        return expect(node.style.opacity).to.be.equal(1) &&
        expect(node.style.transform).to.be.equal(transformString)
    })
    it('should generate SVG spinner', () => {
        return expect(getSpinner(32, '#F00')).equal(spinnerSVG)
    })
})
