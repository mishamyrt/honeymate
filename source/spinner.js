import { applyStyle } from './style-helper'

const getSpinnerSvg = (size, color, clockwise) => `<svg width="${size}" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling"><circle cx="50" cy="50" fill="none" stroke="${color}" stroke-width="10" r="35" stroke-dasharray="164 56" transform="rotate(311.556 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;${clockwise ? '' : '-'}360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>`

export const generateSpinner = (honeyNode) => {
    const { node, parameters } = honeyNode
    const rect = node.getBoundingClientRect()
    const spinNode = document.createElement('div')
    spinNode.innerHTML = getSpinnerSvg(
        parameters['spin-size'],
        parameters['spin-color'],
        parameters['spin-direction'] === 'clockwise',
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
