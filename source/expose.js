import animate from './animation.js';
import waitImages from './wait.js';

export default class ExposeWatcher {
    constructor() {
        this.blocks = [];
        this.watch();
    }
    watch() {
        requestAnimationFrame(() => {
            if (this.blocks.length > 0) {
                const newBlocks = this.blocks;
                const viewportEnd = window.pageYOffset + window.innerHeight;
                this.blocks.forEach(function (block, index) {
                    if (block.self.offsetTop <= viewportEnd) {
                        waitImages(block.self, function () {
                            animate(block);
                        });
                        newBlocks.splice(index, 1);
                    }
                });
                this.blocks = newBlocks;
            }
            if (this.blocks.length > 0) {
                this.watch();
            }
        });
    }
    push(block) {
        this.blocks.push(block);
        this.watch();
    }
}
