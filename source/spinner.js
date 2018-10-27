import { applyStyle } from './helpers'

let used = false

const getSpinnerSvg = (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="${color}" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>`

export const generateSpinner = (honeyNode) => {
    if (!used) {
        const style = document.createElement('style')
        style.innerHTML = '@keyframes honeySpin{0%{transform:rotate(-360deg)}to{transform:rotate(360deg)}}'
        document.head.appendChild(style)
        used = true
    }
    const { node, parameters } = honeyNode
    const rect = node.getBoundingClientRect()
    const spinNode = document.createElement('div')
    spinNode.innerHTML = getSpinnerSvg(
        parameters.spinSize,
        parameters.spinColor,
    )
    applyStyle(spinNode, {
        position: 'absolute',
        top: (rect.top + document.documentElement.scrollTop) + 'px',
        left: (rect.left + document.documentElement.scrollLeft) + 'px',
        width: node.offsetWidth + 'px',
        height: node.offsetHeight + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity .23s ease-out',
    }).then(
        () => document.body.appendChild(spinNode)
    )
    return spinNode
}

export const removeSpinner = (spinNode) => {
    requestAnimationFrame(() => {
        spinNode.style.opacity = 0
        setTimeout(() => {
            document.body.removeChild(spinNode)
        }, 1500)
    })
}
