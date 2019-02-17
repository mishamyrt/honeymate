'use strict'
/* eslint no-global-assign: "off"*/

const frameTime = 1000 / 60

global.requestAnimationFrame = (callback) => setTimeout(callback, frameTime)
