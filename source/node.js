import waitImages from './wait'

const getDirection = (dataset) => {
    if (dataset.right) {
        return 2
    } else if (dataset.down) {
        return 3
    } else if (dataset.left) {
        return 4
    } else {
        return 1
    }
}

const parseParameters = (dataset) => {
    return {
        direction: getDirection(dataset),
        duration: dataset.duration ? dataset.duration : 640,
        effect: dataset.effect ? dataset.effect : 'fade',
        expose: dataset.expose ? dataset.expose === 'true' : false,
        delay: dataset.delay ? dataset.delay : 0,
        scale: dataset.scale ? dataset.scale : 0.87,
        origin: dataset.origin ? dataset.origin : 'bottom',
        offset: dataset.up || dataset.down || dataset.left || dataset.right
            ? dataset.up || dataset.down || dataset.left || dataset.right
            : 32,
    }
}

export default class HoneyNode {
    constructor(node) {
        this.node = node
        this.parameters = parseParameters(node.dataset)
        // console.log(this.parameters)
    }
    async applyEffect(effect) {
        let count = 0
        Object.keys(effect).forEach((key) => {
            this.node.style[key] = effect[key]
            count++
        })
        return count
    }
    async isLoaded() {
        return waitImages(this.node)
    }
    animate() {
        this.applyEffect({
            transform: '',
            opacity: 1,
        })
    }
}
