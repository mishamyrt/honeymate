/**
 * Generates CSS transition string
 * @param {Number} duration Transition duration
 * @param {Object} properties Properties that shoud be transitioned
 * @returns {String}
 */
const generateTransition = (duration, properties) => {
    properties.opacity = 'ease-out'
    let transitionString = ''
    Object.keys(properties).forEach((key) => {
        transitionString += `${key} ${duration}ms ${properties[key]}, `
    })
    return transitionString.substring(0, transitionString.length - 2)
}

/**
 * Generates CSS transform string for slide transition
 * @param {Number} direction Slide direction
 * @param {Number} offset Offset in pixels
 * @returns {String}
 */
const generateSlide = (direction, offset) => {
    let transformString = direction === 1 || direction === 3 ? 'Y' : 'X'
    transformString += direction === 1 || direction === 2 ? '(-' : '('
    return `translate${transformString}${offset}px)`
}

/**
 * Generates effect start point.
 * @param {Object} parameters Slide direction
 * @returns {Object} CSS style object
 */
export const generateEffect = (parameters) => {
    const duration = parameters.duration
    const effect = {}
    switch (parameters.effect) {
        case 'zoom':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,.7,.3,1)',
                })
            effect.transform = `scale(${parameters.scale})`
            break
        case 'helix':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,.75,.25,1)',
                })
            effect.transform = `scale(${parameters.scale}) rotate(90deg)`
            break
        case 'slide':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,.9,.1,1)',
                })
            effect.transform = generateSlide(parameters.direction,
                parameters.offset)
            effect.transformOrigin = parameters.origin
            break
        case 'relax':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,0,.001,1)',
                })
            effect.transform = `scaleY(${parameters.scale})`
            effect.transformOrigin = parameters.origin
            break
        default:
            effect.transition = generateTransition(duration, {})
    }
    return effect
}

