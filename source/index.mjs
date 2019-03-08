import { HoneyNode } from './node.mjs'

const honeyNodes = new Map()

/**
 * Searches node by index
 * @param {Number} i index
 * @returns {HoneyNode}
 */
const nodeByIndex = (i) => honeyNodes.get(Array.from(honeyNodes.keys())[i])

/**
 * Creates a new HoneyNode and adds it to the map
 * @param {HTMLElement} node The original node
 * @returns {HoneyNode}
 */
const addNode = (node) => {
    if (honeyNodes.has(node)) {
        return honeyNodes.get(node)
    }
    const honeyNode = new HoneyNode(node)
    honeyNodes.set(node, honeyNode)
    return honeyNode
}

/**
 * Finds the node that the source node expects
 * @param {Object} parameters HoneyNode parsed parameters
 * @param {Number} index Source node index
 * @returns {HoneyNode|undefined} returns undefined if there is no reason to wait
 */
const findWaited = (parameters, index) => {
    if (parameters.continue && index > 1) {
        return nodeByIndex(index - 1)
    } else if (parameters.await) {
        const node = document.querySelectorAll('#' + parameters.await)[0]
        return node ? addNode(node) : undefined
    }
    return undefined
}

export class Honeymate {
    /**
     * Finds all nodes with .honey class and initiate them
     */
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

    /**
     * Generates HoneyNode from HTMLElement
     * @param {HTMLElement} node source node
     * @returns {HoneyNode}
     */
    static generateNode (node) {
        return new HoneyNode(node)
    }
}
