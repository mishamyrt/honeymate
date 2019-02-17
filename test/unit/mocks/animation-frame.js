'use strict'
/* eslint no-global-assign: "off"*/

global.requestAnimationFrame = (callback) => setTimeout(callback, 1)
