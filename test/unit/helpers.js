'use strict'

const requireES = require('esm')(module)
const {
    describe,
    it,
} = require('mocha')

const {
    getDirection,
    parseParameters,
    applyStyle,
    getSpinner,
} = requireES('../../source/helpers.mjs')

const expect = require('chai').expect

describe('helpers', () => {
    it('should translate transition direction', () => {
        expect(getDirection({
            down: 10,
        })).equal(3)
    })

    it('should parse dataset', () => {
        expect(parseParameters({
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

    it('should apply styles to node', () => {
        const transformString = 'translateY(10px)'
        applyStyle({
            style: {
                opacity: 0,
                transform: '',
            },
        }, {
            opacity: 1,
            transform: transformString,
        }).then((node) => {
            return expect(node.style.opacity).to.be.equal(1) &&
            expect(node.style.transform).to.be.equal(transformString)
        })
    })
    it('should generate SVG spinner', () => {
        expect(getSpinner(32, '#F00')).equal('<svg width="32" height="32" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="#F00" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>')
    })
})
