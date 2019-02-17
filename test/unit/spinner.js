'use strict'

const requireES = require('esm')(module)
const {
    describe,
    it,
} = require('mocha')
const expect = require('chai').expect

const {
    generateSpinner,
    removeSpinner,
} = requireES('../../source/spinner.mjs')

describe('Spinner functions', () => {
    let spinner

    it('should create spinner', (done) => {
        spinner = generateSpinner({
            parameters: {
                spinSize: 32,
                spinColor: '#000',
            },
            node: document.createElement('div'),
        })
        setTimeout(() => {
            expect(spinner.style.top).equals('200px')
            done()
        }, 220)
    })

    it('should remove spinner', (done) => {
        const spinnerId = spinner._uniqueId
        removeSpinner(spinner)
        setTimeout(() => {
            expect(
                document.body._getElementByUnique(spinnerId)
            ).to.be.an('undefined')
            done()
        }, 510)
    })
})
