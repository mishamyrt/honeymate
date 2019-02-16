const bgRegex = /url\(\s*(['"]?)(.*)\1\s*\)/

/**
 * Finds background image on node
 * @param {HTMLElement} node
 * @returns {String|undefined}
 */
const getBackgroundImage = (node) => {
    const style = getComputedStyle(node)
    if (style.background !== '' || style.backgroundImage !== '') {
        const uri = style.background.match(bgRegex)
        return uri ? uri[2] : ''
    }
    return undefined
}

/**
 * Checks if image is loaded
 * @param {String} url Image URL
 * @returns {Promise} Resolves when loaded, never rejects
 */
const waitForImage = (url) => {
    return new Promise((resolve) => {
        const image = new Image()
        image.onload = resolve
        image.onerror = resolve
        image.src = url
    })
}

/**
 * Checks if image is loaded
 * @param {HTMLElement[]} nodes Array of HTMLElement
 * @returns {String[]} URLs of all finded images
 */
const getImagesUrl = (nodes) => {
    const images = []
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === 'IMG') {
            images.push(nodes[i].src)
        } else {
            const url = getBackgroundImage(nodes[i])
            if (url) {
                images.push(url)
            }
        }
    }
    return images
}

/**
 * Checks if all images in node are loaded
 * @param {HTMLElement} node
 * @returns {Promise}
 */
export const waitImages = (node) => {
    return new Promise((resolve) => {
        const checkableNodes = Array.from(node.querySelectorAll('*'))
        checkableNodes.push(node)
        const images = getImagesUrl(checkableNodes)
        if (images.length === 0) {
            resolve()
        } else {
            const promises = []
            images.forEach((url) => {
                promises.push(waitForImage(url))
            })
            Promise.all(promises).then(resolve)
        }
    })
}
