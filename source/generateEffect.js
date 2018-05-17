const generateTransition = (duration, properties) => {
    properties.opacity = 'ease-out'
    let transitionString = ''
    Object.keys(properties).forEach((key) => {
        transitionString += `${key} ${duration}ms ${properties[key]}, `
    })
    return transitionString.substring(0, transitionString.length - 2)
}

const generateSlide = (direction, offset) => {
    let transformString = 'translate'
    switch (direction) {
    case 1:
        transformString += 'Y(-'
        break
    case 2:
        transformString += 'X(-'
        break
    case 3:
        transformString += 'Y('
        break
    case 4:
        transformString += 'X('
        break
    default:
        return ''
    }
    return transformString + `${offset}px)`
}

const generateEffect = (honeyNode) => {
    const { parameters } = honeyNode
    const duration = parameters.duration
    const effect = {}
    switch (parameters.effect) {
    case 'zoom':
        effect.transition = generateTransition(
            duration,
            { transform: 'cubic-bezier(0, 0.7, 0.3, 1)' })
        effect.transform = `scale(${parameters.scale})`
        break
    case 'helix':
        effect.transition = generateTransition(
            duration,
            { transform: 'cubic-bezier(0, 0.75, 0.25, 1)' })
        effect.transform = `scale(${parameters.scale}) rotate(90deg)`
        break
    case 'slide':
        effect.transition = generateTransition(
            duration,
            { transform: 'cubic-bezier(0, 0.9, 0.1, 1)' })
        effect.transform = generateSlide(honeyNode.parameters.direction,
            honeyNode.parameters.offset)
        effect.transformOrigin = parameters.origin
        break
    default:
    case 'relax':
        effect.transition = generateTransition(
            duration,
            { transform: 'cubic-bezier(0, 0, 0.001, 1)' })
        effect.transform = `scaleY(${parameters.scale})`
        effect.transformOrigin = parameters.origin
        break
    }
    // if (parameters.origin) {
    //     effect.transformOrigin = 'center ' + parameters.origin + ' 0px'
    // } else {
    //     effect.transformOrigin = 'center bottom 0px'
    // }
    return effect
}

export default generateEffect
