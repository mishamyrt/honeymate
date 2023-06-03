'use strict'
/* eslint no-global-assign: "off"*/

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min
}

class Image {
    set src (link) {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                this.onload(link)
            }
            this.onerror(link)
        }, getRandomArbitrary(10, 100))
    }

    /* eslint no-empty-function: "off"*/
    onload () { }
    onerror () { }
}
global.Image = Image
