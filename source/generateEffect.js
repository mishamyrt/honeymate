const generateTransition = (duration, properties) => {
    properties.opacity = 'ease-out'
    let transitionString = ''
    Object.keys(properties).forEach((key) => {
        transitionString += `${key} ${duration}ms ${properties[key]}, `
    })
    return transitionString.substring(0, transitionString.length - 2)
}

const generateSlide = (direction, offset) => {
    let transformString = direction === 1 || direction === 3 ? 'Y' : 'X'
    transformString += direction === 1 || direction === 2 ? '(-' : '('
    return `translate${transformString}${offset}px)`
}

const generateEffect = (parameters) => {
    const duration = parameters.duration
    const effect = {}
    switch (parameters.effect) {
        case 'zoom':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0, 0.7, 0.3, 1)',
                })
            effect.transform = `scale(${parameters.scale})`
            break
        case 'helix':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0, 0.75, 0.25, 1)',
                })
            effect.transform = `scale(${parameters.scale}) rotate(90deg)`
            break
        case 'slide':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0, 0.9, 0.1, 1)',
                })
            effect.transform = generateSlide(parameters.direction,
                parameters.offset)
            effect.transformOrigin = parameters.origin
            break
        case 'relax':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0, 0, 0.001, 1)',
                })
            effect.transform = `scaleY(${parameters.scale})`
            effect.transformOrigin = parameters.origin
            break
        default:
        case 'fade':
            effect.transition = generateTransition(duration, { })
    }
    return effect
}

export default generateEffect
