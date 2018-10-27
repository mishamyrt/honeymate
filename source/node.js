import { generateSpinner, removeSpinner } from './spinner'
import { applyStyle } from './style-helper'
import generateEffect from './generateEffect'
import waitImages from './wait'

const getDirection = (dataset) => {
    if (dataset.right) {
        return 2
    } else if (dataset.down) {
        return 3
    } else if (dataset.left) {
        return 4
    } else {
        return 1
    }
}

const parseParameters = (dataset) => ({
    direction: getDirection(dataset),
    duration: dataset.duration ? dataset.duration : 640,
    effect: dataset.effect ? dataset.effect : 'fade',
    expose: dataset.expose ? dataset.expose === 'true' : false,
    delay: dataset.delay ? parseInt(dataset.delay, 10) : 0,
    hold: dataset.hold ? parseInt(dataset.hold, 10) : 0,
    scale: dataset.scale ? dataset.scale : 0.87,
    await: dataset.await ? dataset.await : null,
    'continue': dataset.continue === 'true',
    origin: dataset.origin ? dataset.origin : 'bottom',
    offset: dataset.up || dataset.down || dataset.left || dataset.right ?
        dataset.up || dataset.down || dataset.left || dataset.right : 32,
    spin: dataset.spin === 'true' || false,
    spinColor: dataset['spin-color'] || '#000',
    spinSize: dataset['spin-size'] ? parseInt(dataset['spin-size'], 10) : 24,
})

export default class HoneyNode {
    constructor (node) {
        node.style.opacity = 0
        this.node = node
        this.options = node.dataset
    }

    set options (options) {
        this.parameters = parseParameters(options)
        this.effect = generateEffect(this.parameters)
        if (this.parameters.spin) {
            this.spinner = generateSpinner(this)
        }
    }

    get options () {
        return this.parameters
    }

    isLoaded () {
        return new Promise((resolve) => {
            waitImages(this.node).then(() => setTimeout(() => resolve(), this.parameters.hold))
        })
    }

    animate (effect = this.effect) {
        applyStyle(this.node, effect).then(() => {
            this.isLoaded().then(() => {
                setTimeout(() => {
                    this.expose()
                }, this.parameters.delay)
            })
        })
    }

    expose () {
        applyStyle(this.node, {
            transform: '',
            opacity: 1,
        }).then(() => {
            if (this.parameters.spin) {
                removeSpinner(this.spinner)
            }
        })
    }
}
