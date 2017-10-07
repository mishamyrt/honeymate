import animate, { prepareAnimation } from './animation.js';
import ExposeWatcher from './expose.js';
import HoneyBlock from './block.js';
import waitImages from './wait.js';


export default class honeymate {
    static initiate() {
        let previous = null;
        const watcher = new ExposeWatcher();
        document.querySelectorAll('.honey').forEach(function (block) {
            const honeyblock = new HoneyBlock(block, previous);
            prepareAnimation(honeyblock);
            // blocks.push(honeyblock);
            if (honeyblock.expose) {
                watcher.push(honeyblock);
            }
            else if (honeyblock.waited === null) {
                waitImages(honeyblock.self, function () {
                    animate(honeyblock);
                });
            }
            else {
                const interval = setInterval(function () {
                    if (!honeyblock.waited.classList.contains('is__honeyHidden')) {
                        clearInterval(interval);
                        setTimeout(function () {
                            waitImages(block, function () {
                                animate(honeyblock);
                            });
                        }, block.hold);
                    }
                }, 100);
            }
            previous = block;
        });
    }
}
