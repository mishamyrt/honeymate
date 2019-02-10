import { HoneyNode } from './node.js'

const honeyNodes = new Map()

const nodeByIndex = (i) => honeyNodes.get(Array.from(honeyNodes.keys())[i])

const addNode = (node) => {
    if (honeyNodes.has(node)) {
        return honeyNodes.get(node)
    }
    const honeyNode = new HoneyNode(node)
    honeyNodes.set(node, honeyNode)
    return honeyNode
}

const findWaited = (parameters, i) => {
    if (parameters.continue && i > 1) {
        return nodeByIndex(i - 1)
    } else if (parameters.await) {
        const node = document.querySelectorAll('#' + parameters.await)[0]
        return node ? addNode(node) : undefined
    }
    return undefined
}

export class Honeymate {
    static initiate () {
        const nodes = document.querySelectorAll('.honey')
        for (let i = 0; i < nodes.length; i++) {
            const honeyNode = addNode(nodes[i])
            const waited = findWaited(honeyNode.parameters, i)
            if (waited) {
                waited.isLoaded().then(() => {
                    setTimeout(
                        () => honeyNode.animate(), honeyNode.parameters.hold
                    )
                })
            } else {
                honeyNode.animate()
            }
        }
    }
    static generateNode (node) {
        return new HoneyNode(node)
    }
}
