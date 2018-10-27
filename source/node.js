import { applyStyle, getDirection } from './helpers'
import { generateSpinner, removeSpinner } from './spinner'
import generateEffect from './generateEffect'
import waitImages from './wait'

const parseParameters = (dataset) => ({
    direction: getDirection(dataset),
    duration: dataset.duration || '640',
    effect: dataset.effect || 'fade',
    delay: parseInt(dataset.delay, 10) || 0,
    hold: parseInt(dataset.hold, 10) || 0,
    scale: dataset.scale || '.87',
    await: dataset.await || null,
    origin: dataset.origin || 'bottom',
    offset: dataset.up || dataset.down || dataset.left || dataset.right ?
        dataset.up || dataset.down || dataset.left || dataset.right : 32,
    spin: dataset.spin === 'true',
    spinColor: dataset['spin-color'] || '#000',
    spinSize: dataset['spin-size'] || '24',
    'continue': dataset.continue === 'true',
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
