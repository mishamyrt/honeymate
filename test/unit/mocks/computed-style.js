'use strict'
/* eslint no-global-assign: "off"*/

global.getComputedStyle = (node) => {
    const propertyPattern = /(-([a-z]){1})/g
    const computedStyle = {}
    if (node.style === undefined) {
        return computedStyle
    }
    for (const property in node.style) {
        let finalProperty = property
        if (propertyPattern.test(property)) {
            finalProperty = property.replace(propertyPattern, (a, b, c) => {
                return c.toUpperCase()
            })
        }
        computedStyle[finalProperty] = node.style[property]
    }
    return computedStyle
}

