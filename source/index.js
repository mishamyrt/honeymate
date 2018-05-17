import HoneyNode from './node.js'
import generateEffect from './generateEffect'


export default class Honeymate {
    static initiate() {
        document.querySelectorAll('.honey').forEach((node) => {
            const honeyNode = new HoneyNode(node)
            honeyNode.effect = generateEffect(honeyNode)
            honeyNode.applyEffect(honeyNode.effect).then(() => {
                honeyNode.isLoaded().then(() => {
                    setTimeout(honeyNode.animate(), honeyNode.parameters.delay)
                })
            })
        })
    }
}
