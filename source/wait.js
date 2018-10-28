const bgRegex = /url\(\s*(['"]?)(.*)\1\s*\)/

const getBackgroundImage = (node) => {
    const style = getComputedStyle(node)
    if (style.background !== '' || style.backgroundImage !== '') {
        const uri = style.background.match(bgRegex)
        return uri ? uri[2] : ''
    }
    return ''
}

const waitForImage = (url) => {
    return new Promise((resolve) => {
        const image = new Image()
        image.onload = resolve
        image.onerror = resolve
        image.src = url
    })
}

const getImagesUrl = (nodes) => {
    const images = []
    for (const node of nodes) {
        if (node.tagName === 'IMG') {
            images.push(node.getAttribute('src'))
        } else {
            const url = getBackgroundImage(node)
            if (url) {
                images.push(url)
            }
        }
    }
    return images
}

const waitImages = (node) => {
    return new Promise((resolve) => {
        const checkableNodes = Array.from(node.querySelectorAll('*'))
        checkableNodes.push(node)
        const images = getImagesUrl(checkableNodes)
        if (images.length === 0) {
            resolve(0)
        } else {
            const promises = []
            images.forEach((url) => {
                promises.push(waitForImage(url))
            })
            Promise.all(promises).then(() => {
                resolve(images.length)
            })
        }
    })
}

export default waitImages