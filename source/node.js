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
        delay: dataset.delay ? parseInt(dataset.delay, 10) : 0,
        hold: dataset.hold ? parseInt(dataset.hold, 10) : 0,
        scale: dataset.scale ? dataset.scale : 0.87,
        await: dataset.await ? dataset.await : null,
        'continue': dataset.continue === 'true',
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
        return new Promise((resolve) => {
            waitImages(this.node).then(() => setTimeout(() => resolve(), this.parameters.hold))
        })
    }
    animate(effect) {
        this.applyEffect(effect).then(() => {
            this.isLoaded().then(() => {
                setTimeout(() => this.expose(), this.parameters.delay)
            })
        })
    }
    expose() {
        this.applyEffect({
            transform: '',
            opacity: 1,
        })
    }
}
