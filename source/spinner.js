import { applyStyle, getSpinnerSVG } from './helpers'

export const generateSpinner = (honeyNode) => {
    const { node } = honeyNode
    const rect = node.getBoundingClientRect()
    const spinNode = document.createElement('div')
    const element = document.documentElement
    spinNode.innerHTML = getSpinnerSVG(
        honeyNode.parameters.spinSize,
        honeyNode.parameters.spinColor,
    )
    setTimeout(() =>
        applyStyle(spinNode, {
            position: 'absolute',
            top: (rect.top + element.scrollTop) + 'px',
            left: (rect.left + element.scrollLeft) + 'px',
            width: node.offsetWidth + 'px',
            height: node.offsetHeight + 'px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity .23s ease-out',
        }).then(
            () => document.body.appendChild(spinNode)
        ), 200)
    return spinNode
}

export const removeSpinner = (spinNode) => {
    requestAnimationFrame(() => {
        spinNode.style.opacity = 0
        setTimeout(() => {
            document.body.removeChild(spinNode)
        }, 500)
    })
}
