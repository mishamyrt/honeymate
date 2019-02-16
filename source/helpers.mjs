/**
 * Converts the text direction to a number
 * @param {Object} dataset HTMLElement dataset
 * @returns {Number}
 */
export const getDirection = (dataset) => {
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

/**
 * Transform dataset to HoneyNode parameters
 * @param {Object} dataset HTMLElement dataset
 * @returns {Object}
 */
export const parseParameters = (dataset) => ({
    direction: getDirection(dataset),
    duration: dataset.duration || 640,
    effect: dataset.effect || '',
    expose: dataset.expose === 'true' && 'IntersectionObserver' in window,
    delay: parseInt(dataset.delay, 10) || 0,
    hold: parseInt(dataset.hold, 10) || 0,
    scale: dataset.scale || '.87',
    await: dataset.await || null,
    origin: dataset.origin || 'bottom',
    offset: dataset.up ||
            dataset.down ||
            dataset.left ||
            dataset.right ?
        dataset.up ||
        dataset.down ||
        dataset.left ||
        dataset.right : 32,
    spin: dataset.spin === 'true',
    spinColor: dataset['spin-color'] || '#000',
    spinSize: dataset['spin-size'] || 24,
    'continue': dataset.continue === 'true',
})

/**
 * Applies CSS styles to the node
 * @param {HTMLElement} node HTMLElement
 * @param {Object} style CSS styles
 * @returns {Promise} Resolves when styles is applied
 */
export const applyStyle = (node, style) => {
    return new Promise((resolve) => {
        for (const key in style) {
            node.style[key] = style[key]
        }
        resolve()
    })
}

/**
 * Generates spinner SVG string
 * @param {Number} size Spinner size
 * @param {color} color Spinner color
 * @returns {String}
 */
export const getSpinner = (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="${color}" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>`
