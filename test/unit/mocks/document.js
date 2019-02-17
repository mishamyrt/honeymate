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

class HTMLElement {
    constructor (tag) {
        this.tagName = tag.toUpperCase()
        this.style = {
            width: '100px',
            height: '100px',
            margin: '0',
        }
        this.children = []
    }

    createElement (tag) {
        return new HTMLElement(tag)
    }

    appendChild (node) {
        this.children.push(node)
    }

    querySelectorAll (selector) {
        if (selector.trim() === '*') {
            const list = all(this)
            list.push(this)
            return list
        }
        return this.children
    }
}

global.document = new HTMLElement('document')

