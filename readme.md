<h1 align="center">
<br>
    <img src="https://mishamyrt.github.io/honeymate/img/logo.svg" alt="Honeymate logo" width="150">
<br>
  Honeymate
<br>
</h1>

<h4 align="center">
    Beautiful page load coordinator.
</h4>
<p align="center">
    Honeymate waits for loading images in blocks and then shows with the selected animation. Allows you to easily manage the page load order, indicating the order in which items are displayed
<p>

<p align="center">
    <a href="https://travis-ci.org/mishamyrt/honeymate">
        <img height="18" src="https://travis-ci.org/mishamyrt/honeymate.svg?branch=master">
    </a>
    <a href="https://badge.fury.io/js/mishamyrt-honeymate">
        <img src="https://badge.fury.io/js/mishamyrt-honeymate.svg" alt="npm version" height="18">
    </a>
    <img src="https://david-dm.org/mishamyrt/honeymate.svg" alt="David's dependencies control" height="18">
    <a href="https://www.codacy.com/app/mishamyrt/honeymate?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mishamyrt/honeymate&amp;utm_campaign=Badge_Grade">
        <img src="https://api.codacy.com/project/badge/Grade/84b678784f7e49e4b2e12ad6a0bc7839" alt="Codacy Badge" height="18">
    </a>
</p>

<img src="https://mishamyrt.github.io/honeymate/img/preview.gif" alt="Honeymate logo">

**Simple.** Honeymate has declarative API therefore has a low entry threshold.

**Small.** 2.2 kilobytes (minified and gzipped). No dependencies.

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

Honeymate can be used as a CommonJS module, so you can use it within webpack or Rollup build systems.

First, install Honeymate using npm:

```sh
$ npm install mishamyrt-honeymate --save
```

Then, use it somewhere in your program:

```js
import { Honeymate } from 'mishamyrt-honeymate'

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
honeyNode.isLoaded().then(() => honeyNode.expose())
```

## Options

These options could be specified on the block with the `honey` class.

* `data-effect` — Current effect. Available effects: helix, fade (default), relax, zoom. 
* `data-hold` — Hold on for this number of milliseconds (at least this much time should elapse after an element, which the given one was waiting for, have started emerging).
* `data-origin` — For relax, zoom and helix effects, the transformation origin. Default is ‘bottom’.
* `data-duration` — The animation duration in milliseconds. Default is 600.
* `data-await` — Wait for element with ID from value to load (but not finish the animation). 
* `data-scale` — For relax, zoom and helix effects, the initial scale. The default is 0.87.
* `data-expose` — Wait until the user scrolls to the element. If a hold time is set, it is calculated from the moment when the element gets into view. This parameter uses IntersectionObserver for greater performance. In browsers that do not [support](https://caniuse.com/#feat=intersectionobserver) this, the parameter will be ignored.
* `data-spin` — Show loading indicator.
* `data-spin-size` — Indicator diameter in pixels. Default is 24.
* `data-spin-color` — Indicator colour. Default is black.

```html
<div class="honey"
     data-effect="helix"
     data-delay="400"
     data-spin="true">
    <img src="img/example.jpg">
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

## Credits
The original idea belongs to Ilya Birman, who made the “[Emerge](https://ilyabirman.ru/projects/emerge/)”. I have only made a free alternative that focuses on performance and does not depend on a jQuery.

## Supported browsers

Honeymate supports the latest versions of Safari, Chrome and Firefox. In unsupported browsers, the page will load as if the library was not linked.