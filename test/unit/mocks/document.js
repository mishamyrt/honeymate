'use strict'
/* eslint no-global-assign: "off"*/

const all = (node) => {
    const nodes = []
    nodes.push(...node.children)
    for (let i = 0; i < node.children.length; i++) {
        nodes.push(...all(node.children[i]))
    }
    return nodes
}

const dictinary = 'abcdefghijklmnopqrstuvwxyz0123456789'

class HTMLElement {
    constructor (tag) {
        this.tagName = tag.toUpperCase()
        this.style = {
            width: '100px',
            height: '100px',
            margin: '0',
        }
        this.innerHtml = ''
        this.documentElement = {
            scrollTop: 100,
            scrollLeft: 100,
        }
        this.offsetWidth = 100
        this.offsetHeight = 100
        this.children = []
        this.classList = {
            add: this.addClass,
        }
        this.dataset = {}

        let id = ''
        for (let i = 0; i < 5; i++) {
            id += dictinary.charAt(Math.floor(Math.random() * dictinary.length))
        }
        this._uniqueId = id
    }

    createElement (tag) {
        return new HTMLElement(tag)
    }

    appendChild (node) {
        this.children.push(node)
    }

    _getElementByUnique (uniqueId) {
        let finded = -1
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]._uniqueId === uniqueId) {
                finded = i
            }
        }
        if (finded === -1) {
            return undefined
        }
        return this.children[finded]
    }

    addClass (className) {
        if (this._classList === undefined) {
            this._classList = []
        }
        this._classList.push(className)
    }

    removeChild (node) {
        this.children = this.children.filter((child) => {
            if (node._uniqueId === child._uniqueId) {
                return false
            }
            return true
        })
    }

    querySelectorAll (selector) {
        if (selector.trim() === '*') {
            const list = all(this)
            list.push(this)
            return list
        }
        return this.children
    }

    getBoundingClientRect () {
        return {
            top: 100,
            left: 100,
        }
    }
}

const document = new HTMLElement('document')
document.body = new HTMLElement('body')
global.document = document
