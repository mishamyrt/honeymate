import { applyStyle, parseParameters } from './helpers'
import { generateSpinner, removeSpinner } from './spinner'
import { generateEffect } from './generateEffect'
import { waitImages } from './wait'

export class HoneyNode {
    constructor (node) {
        node.style.opacity = 0
        this.node = node
        this.node.classList.add('honey_ready')
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
            waitImages(this.node).then(
                () => setTimeout(
                    () => resolve(), this.parameters.hold
                )
            )
        })
    }

    isInView () {
        return new Promise((resolve) => {
            const observer = new IntersectionObserver(
                (data) => {
                    if (data[0].isIntersecting && data[0].time > 70) {
                        resolve()
                        observer.disconnect()
                    }
                }
            )
            observer.observe(this.node)
        })
    }

    animate (effect = this.effect) {
        applyStyle(this.node, effect).then(() => {
            Promise.all([
                this.parameters.expose ? this.isInView() : null,
                this.isLoaded(),
            ]).then(() => {
                setTimeout(() => this.expose(), this.parameters.delay)
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
