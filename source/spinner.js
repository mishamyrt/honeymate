import { applyStyle, getSpinnerSVG } from './helpers'

let firstUse = true

export const generateSpinner = (honeyNode) => {
    if (firstUse) {
        document.head.appendChild(
            document.createElement('style')
                .innerHTML = '@keyframes honeySpin{0%{transform:rotate(-360deg)}to{transform:rotate(360deg)}}'
        )
        firstUse = false
    }
    const { node, parameters } = honeyNode
    const rect = node.getBoundingClientRect()
    const spinNode = document.createElement('div')
    spinNode.innerHTML = getSpinnerSVG(
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
