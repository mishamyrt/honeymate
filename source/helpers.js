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

export const applyStyle = (node, style) => {
    return new Promise((resolve) => {
        for (const key in style) {
            node.style[key] = style[key]
        }
        resolve()
    })
}
