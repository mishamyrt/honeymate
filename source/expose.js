import waitImages from './wait.js'
import animate from './animation.js'

export default class ExposeWatcher {
  constructor() {
    this.blocks = []
    this.watch()
  }
  watch() {
    requestAnimationFrame(() => {
      if (this.blocks.length > 0) {
        let newBlocks = this.blocks
        let viewportEnd = window.pageYOffset + window.innerHeight;
        this.blocks.forEach(function (block, index) {
          if (block.self.offsetTop <= viewportEnd) {
            waitImages(block.self, function () {
              animate(block);
            });
            newBlocks.splice(index, 1);
          }
        });
        this.blocks = newBlocks
      }
      this.watch()
    })
  }
  push(block) {
    this.blocks.push(block);
  }
}