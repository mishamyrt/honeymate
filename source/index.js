import HoneyNode from './node.js'
import generateEffect from './generateEffect'

const honeyNodes = new Map()

const nodeByIndex = (i) => honeyNodes.get(Array.from(honeyNodes.keys())[i])

const addNode = (node) => {
    if (honeyNodes.has(node)) {
        return honeyNodes[node]
    } else {
        const honeyNode = new HoneyNode(node)
        honeyNodes.set(node, honeyNode)
        return honeyNode
    }
}

const findWaited = (parameters, i) => {
    if (parameters.continue && i > 1) {
        return nodeByIndex(i - 1)
    } else if (parameters.await) {
        const node = document.getElementById(parameters.await)
        if (node) {
            return addNode(node)
        }
    }
    return -1
}

export default class Honeymate {
    static initiate() {
        const nodes = document.querySelectorAll('.honey')
        for (let i = 0; i < nodes.length; i++) {
            const honeyNode = addNode(nodes[i])
            const effect = generateEffect(honeyNode)
            const waited = findWaited(honeyNode.parameters, i)
            if (waited === -1) {
                honeyNode.animate(effect)
            } else {
                waited.isLoaded().then(() => {
                    setTimeout(() => {
                        honeyNode.animate(effect)
                    }, honeyNode.parameters.hold)
                })
            }
        }
    }
}
