import waitImages from './wait.js'
import HoneyBlock from './block.js'
import ExposeWatcher from './expose.js'
import animate, { prepareAnimation } from './animation.js'

export default class honeymate {
    static initiate() {
        let blocks = [];
        let previous = null;
        let watcher = new ExposeWatcher()
        document.querySelectorAll(".honey").forEach(function (block, i) {
            let honeyblock = new HoneyBlock(block, previous);
            prepareAnimation(honeyblock)
            // blocks.push(honeyblock);
            if (honeyblock.expose) {
                watcher.push(honeyblock)
            } else {
                if (honeyblock.waited == null) {
                    waitImages(honeyblock.self, function () {
                        animate(honeyblock);
                    });
                } else {
                    let interval = setInterval(function () {
                        if (!honeyblock.waited.classList.contains("is__honeyHidden")) {
                            clearInterval(interval);
                            setTimeout(function () {
                                waitImages(block, function () {
                                    animate(honeyblock);
                                });
                            }, block.hold);
                        }
                    }, 100);
                }
            }
            previous = block;
        });
    }
}