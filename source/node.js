import { applyStyle, parseParameters } from './helpers'
import { generateSpinner, removeSpinner } from './spinner'
import { generateEffect } from './generateEffect'
import { waitImages } from './wait'

export class HoneyNode {
    /**
     * @param {HTMLElement} node The original node
     */
    constructor (node) {
        node.style.opacity = 0
        this.node = node
        this.node.classList.add('honey_ready')
        this.options = node.dataset
    }

    /**
    * Options setter. Parses parameters after set
    * @param {Object} options Raw HoneyNode options
    */
    set options (options) {
        this.parameters = parseParameters(options)
        this.effect = generateEffect(this.parameters)
        if (this.parameters.spin) {
            this.spinner = generateSpinner(this)
        }
    }

    /**
    * Options getter
    * @param {Object} options Raw HoneyNode options
    * @returns {Object} Current options
    */
    get options () {
        return this.parameters
    }

    /**
    * Checks if all images in node are loaded
    * @returns {Promise} Resolves when loaded, never rejects
    */
    isLoaded () {
        return new Promise((resolve) => {
            waitImages(this.node).then(
                () => setTimeout(
                    () => resolve(), this.parameters.hold
                )
            )
        })
    }

    /**
    * Checks if node is in user's view
    * @returns {Promise} Resolves when HoneyNode in view
    */
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

    /**
    * Waits for all conditions and displays the node
    * @param {Object} effect Generated effect. Default is built on current parameters
    */
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

    /**
    * Exposes the node by applying basic transform and opacity
    */
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
