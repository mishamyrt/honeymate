'use strict'

const requireES = require('esm')(module)
const {
    describe,
    it,
} = require('mocha')
const expect = require('chai').expect

const { generateEffect } = requireES('../../source/generateEffect.mjs')
const { parseParameters } = requireES('../../source/helpers.mjs')

const transitions = {
    zoom: 'transform 400ms cubic-bezier(0,.7,.3,1), opacity 400ms ease-out',
    fade: 'opacity 400ms ease-out',
    slide: 'transform 400ms cubic-bezier(0,.9,.1,1), opacity 400ms ease-out',
    helix: 'transform 400ms cubic-bezier(0,.75,.25,1), opacity 400ms ease-out',
    relax: 'transform 400ms cubic-bezier(0,0,.001,1), opacity 400ms ease-out',
}

const transforms = {
    slide: 'translateY(-10px)',
    helix: 'scale(.87) rotate(90deg)',
    relax: 'scaleY(0.5)',
}

describe('Effects generation', () => {
    it('should generate fade effect', () => {
        return expect(generateEffect(
            parseParameters({
                effect: 'fade',
                duration: 400,
            })
        ).transition).equals(transitions.fade)
    })

    it('should generate zoom effect', () => {
        return expect(generateEffect(
            parseParameters({
                effect: 'zoom',
                duration: 400,
            })
        ).transition).equals(transitions.zoom)
    })

    it('should generate slide effect', () => {
        const effect = generateEffect(
            parseParameters({
                effect: 'slide',
                duration: 400,
                up: 10,
            })
        )
        return expect(effect.transition).equals(transitions.slide) &&
        expect(effect.transform).equals(transforms.slide)
    })

    it('should generate helix effect', () => {
        const effect = generateEffect(
            parseParameters({
                effect: 'helix',
                duration: 400,
            })
        )
        return expect(effect.transition).equals(transitions.helix) &&
        expect(effect.transform).equals(transforms.helix)
    })

    it('should generate relax effect', () => {
        const effect = generateEffect(
            parseParameters({
                effect: 'relax',
                duration: 400,
                scale: 0.5,
            })
        )
        return expect(effect.transition).equals(transitions.relax) &&
        expect(effect.transform).equals(transforms.relax)
    })
})
