# Honeymate [![Build Status](https://travis-ci.org/mishamyrt/honeymate.svg?branch=master)][ci]

<a href="http://mishamyrt.github.io/honeymate/"><img src="./img/logo.svg" align="right" alt="Honeymate logo" width="194" height="198"></a>

Dead simple loading animations

**UX.** The main advantage is that the averto is not modal. 
This means that the notification does not block the interface.

**Small.** 1.8 kilobytes (minified and gzipped). No dependencies.

**Accessible.** All options are used to increase availability.

## Take a look

See Honeymate in action on its [homepage](https://myrt.co/tools/honeymate/).

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
<script src="path/to/honeymate.js" type="text/javascript"></script>
```

If installed with npm:

```html
<script src="node_modules/mishamyrt-honeymate/release/honeymate.js"
        type="text/javascript"></script>
```

Then, add to the pictured `div` class `honey`:

```html
<div class="honey">
    <img src="./img/foo.jpg">
</div>
```

Honeymate will wait until all images will be loaded and then show block.


### Using as a ES6 module

Honeymate can be used as a ES6 module, so you can use it within webpack or browserify build systems.

First, install Honeymate using npm:

```sh
$ npm install mishamyrt-honeymate --save
```

Then, use it as ES6 module somewhere in your program:

```js
import Honeymate from 'mishamyrt-honeymate'

// Finds all honeymated blocks in the DOM and initializes them
Honeymate.initiate()
```

## Options

These options should be specified on the `div` with the `honey` class.

* `data-effect` — Current effect. Available effects: helix, fade (default), relax, zoom. 
* `data-hold` — Hold on for this number of milliseconds (at least this much time should elapse after an element, which the given one was waiting for, have started emerging).
* `data-origin` — For relax, zoom and helix effects, the transformation origin. Default is «top» for relax and «center center» for zoom and helix.
* `data-duration` — The animation duration in milliseconds. Default is 600 milliseconds.
* `data-expose` — Wait until the user scrolls to the element. If a hold time is set, it is calculated from the moment when the element gets into view.
* `data-await` — Wait for element with id from value to load (but not finish the animation). 

```html
<div class="honey" data-effect="helix" data-delay="400">
    <img src="./img/foo.jpg">
</div>
```

## Supported browsers

I support Safari 11+ and the latest versions of Chrome, Firefox and Edge. Honeymate could work in the older versions too, but i don’t do anything specific to maintain its compatibility with them and don’t test it there.

[ci]: https://travis-ci.org/mishamyrt/honeymate