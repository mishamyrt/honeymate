# Honeymate [![Build Status](https://travis-ci.org/mishamyrt/honeymate.svg?branch=master)][ci]

<a href="http://mishamyrt.github.io/honeymate/"><img src="./img/logo.svg" align="right" alt="Honeymate logo" width="150"></a>

Honeymate is a page load coordinator.

**Simple.** Honeymate has declarative API therefore has a low entry threshold.

**Small.** 2.4 kilobytes (minified and gzipped). No dependencies.

**Fast.** Only CSS animations wrapped in a `requestAnimationFrame` are used.

## Get

[Download the repository code](https://github.com/mishamyrt/Honeymate/archive/master.zip) and move `dist/honeymate.js` to the desired directory.

Or use npm:

```sh
$ npm install mishamyrt-honeymate --save
```

## Setup

Link the file `honeymate.js` from the compiled sources.

If downloaded directly:
```html
<script src="path/to/honeymate.js"
        type="text/javascript"></script>
```

If installed with npm:

```html
<script src="node_modules/mishamyrt-honeymate/dist/honeymate.js"
        type="text/javascript"></script>
```

Now any element with `class="honey"` will fade in after its contents are loaded:

```html
<div class="honey">
  ... Show this only when it is ready ...
</div>
```

### Using as a module

Honeymate can be used as a AMD module, so you can use it within webpack or Rollup build systems.

First, install Honeymate using npm:

```sh
$ npm install mishamyrt-honeymate --save
```

Then, use it somewhere in your program:

```js
import Honeymate from 'mishamyrt-honeymate'

// Finds all honeymated blocks in the DOM and initializes them
Honeymate.initiate()
```

You can also control Honeymate event loop manually:

```js
import Honeymate from 'mishamyrt-honeymate'

// Creates an instance of the class HoneyNode
const honeyNode = Honeymate.generateNode(
    document.querySelector('.node-selector')
)

// Shows the node after loading images
honeyNode.isLoaded().then(() => node.expose())
```

## Options

These options could be specified on the block with the `honey` class.

* `data-effect` — Current effect. Available effects: helix, fade (default), relax, zoom. 
* `data-hold` — Hold on for this number of milliseconds (at least this much time should elapse after an element, which the given one was waiting for, have started emerging).
* `data-origin` — For relax, zoom and helix effects, the transformation origin. Default is ‘top’ for relax and ‘center’ for zoom and helix.
* `data-duration` — The animation duration in milliseconds. Default is 600.
* `data-await` — Wait for element with id from value to load (but not finish the animation). 
* `data-scale` — For relax, zoom and helix effects, the initial scale. The default is 0.87. 
* `data-spin` — Show loading indicator.
* `data-spin-size` — Indicator diameter in pixels. Default is 24.
* `data-spin-color` — Indicator colour. Default is black.

```html
<div class="honey"
     data-effect="helix"
     data-delay="400"
     data-spin="true">
    <img src="./img/foo.jpg">
</div>
```

Them can also be a parameter when working with an AMD module. To do this, use the same parameters without the `data` prefix.

```js
const honeyNode = Honeymate.generateNode(
    document.querySelector('.node-selector')
)

honeyNode.options = {
    effect: 'zoom',
    scale: 0.93,
    duration: 500,
    spin: true,
    'spin-color': '#663399',
}
```

## Supported browsers

Latest Webkit, Blink browsers and Firefox fully supported. In unsupported browsers page will load as if there were no Emerge in the first place. Same thing with disabled Javascript.

[ci]: https://travis-ci.org/mishamyrt/honeymate