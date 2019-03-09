'use strict'

const requireES = require('esm')(module)
const {
    describe,
    it,
} = require('mocha')
const expect = require('chai').expect

const {
    getBackgroundImage,
    waitForImage,
    getImagesUrl,
    waitImages,
} = requireES('../../source/wait.mjs')

const imageUrl = {
    link: '/img/test.jpg',
    css: 'url(/img/test.jpg)',
}

const getNode = () => {
    const node = document.createElement('div')
    node.imageCount = 0
    for (let i = 0; i < 5; i++) {
        const childNode = document.createElement('div')
        childNode.style.background = imageUrl.css
        node.imageCount++
        for (let j = 0; j < 5; j++) {
            const subChildNode = document.createElement('img')
            node.imageCount++
            subChildNode.src = imageUrl.link
            childNode.appendChild(subChildNode)
        }
        node.appendChild(childNode)
    }
    return node
}

describe('Image wait functions', () => {
    it('should get URL from `background` property', () => {
        return expect(
            getBackgroundImage({
                style: {
                    background: imageUrl.css,
                },
            })
        ).equals(imageUrl.link)
    })

    it('should get URL from `background-image` property', () => {
        return expect(
            getBackgroundImage({
                style: {
                    'background-image': imageUrl.css,
                },
            })
        ).equals(imageUrl.link)
    })

    it('should get images URL from tree', () => {
        const nodes = getNode().querySelectorAll('*')
        expect(getImagesUrl(nodes)).to.have.lengthOf(nodes.length - 1)
    })

    it('should wait until single image is loaded', async () => {
        await waitForImage(imageUrl.link)
        expect(true).equals(true)
    })

    it('should wait until all images are loaded', async () => {
        await waitImages(getNode())
        expect(true).equals(true)
    })
})
