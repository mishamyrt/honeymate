import Honeymate from './index.js'

document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style')
    style.innerHTML = '.honey{opacity:0}'
    document.head.appendChild(style)
    Honeymate.initiate()
})