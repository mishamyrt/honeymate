/**
 * Converts the text direction to a number
 * @param {Object} dataset HTMLElement dataset
 * @returns {Number}
 */
const getDirection = (dataset) => {
    if (dataset.right) {
        return 2
    } else if (dataset.down) {
        return 3
    } else if (dataset.left) {
        return 4
    } else {
        return 1
    }
};

/**
 * Transform dataset to HoneyNode parameters
 * @param {Object} dataset HTMLElement dataset
 * @returns {Object}
 */
const parseParameters = (dataset) => ({
    direction: getDirection(dataset),
    duration: dataset.duration || 640,
    effect: dataset.effect || '',
    expose: dataset.expose === 'true' && 'IntersectionObserver' in window,
    delay: parseInt(dataset.delay, 10) || 0,
    hold: parseInt(dataset.hold, 10) || 0,
    scale: dataset.scale || '.87',
    await: dataset.await || null,
    origin: dataset.origin || 'bottom',
    offset: dataset.up ||
            dataset.down ||
            dataset.left ||
            dataset.right ?
        dataset.up ||
        dataset.down ||
        dataset.left ||
        dataset.right : 32,
    spin: dataset.spin === 'true',
    spinColor: dataset['spin-color'] || '#000',
    spinSize: dataset['spin-size'] || 24,
    'continue': dataset.continue === 'true',
});

/**
 * Applies CSS styles to the node
 * @param {HTMLElement} node HTMLElement
 * @param {Object} style CSS styles
 * @returns {Promise} Resolves when styles is applied
 */
const applyStyle = (node, style) => {
    return new Promise((resolve) => {
        for (const key in style) {
            node.style[key] = style[key];
        }
        resolve(node);
    })
};

/**
 * Generates spinner SVG string
 * @param {Number} size Spinner size
 * @param {color} color Spinner color
 * @returns {String}
 */
const getSpinner = (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="${color}" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>`;

/**
 * Generates spinner node in DOM
 * @param {HoneyNode} honeyNode Source node
 * @returns {HTMLElement}
 */
const generateSpinner = (honeyNode) => {
    const { node } = honeyNode;
    const rect = node.getBoundingClientRect();
    const spinNode = document.createElement('div');
    const element = document.documentElement;
    spinNode.innerHTML = getSpinner(
        honeyNode.parameters.spinSize,
        honeyNode.parameters.spinColor,
    );
    setTimeout(() =>
        applyStyle(spinNode, {
            position: 'absolute',
            top: (rect.top + element.scrollTop) + 'px',
            left: (rect.left + element.scrollLeft) + 'px',
            width: node.offsetWidth + 'px',
            height: node.offsetHeight + 'px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity .23s ease-out',
        }).then(
            () => document.body.appendChild(spinNode)
        ), 200);
    return spinNode
};

/**
 * Hides and removes spinner from DOM
 * @param {HTMLElement} spinNode Spinner node in DOM
 */
const removeSpinner = (spinNode) => {
    requestAnimationFrame(() => {
        spinNode.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(spinNode);
        }, 500);
    });
};

/**
 * Generates CSS transition string
 * @param {Number} duration Transition duration
 * @param {Object} properties Properties that shoud be transitioned
 * @returns {String}
 */
const generateTransition = (duration, properties) => {
    properties.opacity = 'ease-out';
    let transitionString = '';
    for (const [property, transition] of Object.entries(properties)) {
        transitionString += `${property} ${duration}ms ${transition}, `;
    }
    return transitionString.substring(0, transitionString.length - 2)
};

/**
 * Generates CSS transform string for slide transition
 * @param {Number} direction Slide direction
 * @param {Number} offset Offset in pixels
 * @returns {String}
 */
const generateSlide = (direction, offset) => {
    let transformString = direction === 1 || direction === 3 ? 'Y' : 'X';
    transformString += direction === 1 || direction === 2 ? '(-' : '(';
    return `translate${transformString}${offset}px)`
};

/**
 * Generates effect start point.
 * @param {Object} parameters Slide direction
 * @returns {Object} CSS style object
 */
const generateEffect = (parameters) => {
    const duration = parameters.duration;
    const effect = {};
    switch (parameters.effect) {
        case 'zoom':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,.7,.3,1)',
                });
            effect.transform = `scale(${parameters.scale})`;
            break
        case 'helix':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,.75,.25,1)',
                });
            effect.transform = `scale(${parameters.scale}) rotate(90deg)`;
            break
        case 'slide':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,.9,.1,1)',
                });
            effect.transform = generateSlide(parameters.direction,
                parameters.offset);
            effect.transformOrigin = parameters.origin;
            break
        case 'relax':
            effect.transition = generateTransition(
                duration, {
                    transform: 'cubic-bezier(0,0,0,1)',
                });
            effect.transform = `scaleY(${parameters.scale})`;
            effect.transformOrigin = parameters.origin;
            break
        default:
            effect.transition = generateTransition(duration, {});
    }
    return effect
};

const cssUrlPattern = /url\(\s*(['"]?)(.*)\1\s*\)/;

/**
 * Finds background image on node
 * @param {HTMLElement} node
 * @returns {String|undefined}
 */
const getBackgroundImage = (node) => {
    const style = getComputedStyle(node);
    if (style.background && style.background !== '') {
        const url = style.background.match(cssUrlPattern);
        return url ? url[2] : ''
    } else if (style.backgroundImage && style.backgroundImage !== '') {
        const url = style.backgroundImage.match(cssUrlPattern);
        return url ? url[2] : ''
    }
    return undefined
};

/**
 * Checks if image is loaded
 * @param {String} url Image URL
 * @returns {Promise} Resolves when loaded, never rejects
 */
const waitForImage = (url) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = url;
    })
};

/**
 * Checks if image is loaded
 * @param {HTMLElement[]} nodes Array of HTMLElement
 * @returns {String[]} URLs of all finded images
 */
const getImagesUrl = (nodes) => {
    const images = [];
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === 'IMG') {
            images.push(nodes[i].src);
        } else {
            const url = getBackgroundImage(nodes[i]);
            if (url) {
                images.push(url);
            }
        }
    }
    return images
};

/**
 * Checks if all images in node are loaded
 * @param {HTMLElement} node
 * @returns {Promise}
 */
const waitImages = (node) => {
    return new Promise((resolve) => {
        const checkableNodes = Array.from(node.querySelectorAll('*'));
        checkableNodes.push(node);
        const images = getImagesUrl(checkableNodes);
        if (images.length === 0) {
            resolve();
        } else {
            const promises = [];
            images.forEach((url) => {
                promises.push(waitForImage(url));
            });
            Promise.all(promises).then(resolve);
        }
    })
};

class HoneyNode {
    /**
     * @param {HTMLElement} node The original node
     */
    constructor (node) {
        node.style.opacity = 0;
        this.node = node;
        this.node.classList.add('honey_ready');
        this.options = node.dataset;
    }

    /**
    * Options setter. Parses parameters after set
    * @param {Object} options Raw HoneyNode options
    */
    set options (options) {
        this.parameters = parseParameters(options);
        this.effect = generateEffect(this.parameters);
        if (this.parameters.spin) {
            this.spinner = generateSpinner(this);
        }
    }

    /**
    * Options getter
    * @returns {Object} Current options
    */
    get options () {
        return this.parameters
    }

    /**
    * Checks if all images in node are loaded
    * @returns {Promise} Resolves when loaded, never rejects
    */
    isLoaded () {
        return new Promise((resolve) => {
            waitImages(this.node).then(
                () => setTimeout(
                    () => resolve(), this.parameters.hold
                )
            );
        })
    }

    /**
    * Checks if node is in user's view
    * @returns {Promise} Resolves when HoneyNode in view
    */
    isInView () {
        return new Promise((resolve) => {
            const observer = new IntersectionObserver(
                (data) => {
                    if (data[0].isIntersecting && data[0].time > 70) {
                        resolve();
                        observer.disconnect();
                    }
                }
            );
            observer.observe(this.node);
        })
    }

    /**
    * Waits for all conditions and displays the node
    * @param {Object} effect Generated effect. Default is built on current parameters
    */
    animate (effect = this.effect) {
        applyStyle(this.node, effect).then(() => {
            Promise.all([
                this.parameters.expose ? this.isInView() : null,
                this.isLoaded(),
            ]).then(() => {
                setTimeout(() => this.expose(), this.parameters.delay);
            });
        });
    }

    /**
    * Exposes the node by applying basic transform and opacity
    */
    expose () {
        applyStyle(this.node, {
            transform: '',
            opacity: 1,
        }).then(() => {
            if (this.parameters.spin) {
                removeSpinner(this.spinner);
            }
        });
    }
}

const honeyNodes = new Map();

/**
 * Searches node by index
 * @param {Number} i index
 * @returns {HoneyNode}
 */
const nodeByIndex = (i) => honeyNodes.get(Array.from(honeyNodes.keys())[i]);

/**
 * Creates a new HoneyNode and adds it to the map
 * @param {HTMLElement} node The original node
 * @returns {HoneyNode}
 */
const addNode = (node) => {
    if (honeyNodes.has(node)) {
        return honeyNodes.get(node)
    }
    const honeyNode = new HoneyNode(node);
    honeyNodes.set(node, honeyNode);
    return honeyNode
};

/**
 * Finds the node that the source node expects
 * @param {Object} parameters HoneyNode parsed parameters
 * @param {Number} index Source node index
 * @returns {HoneyNode|undefined} returns undefined if there is no reason to wait
 */
const findWaited = (parameters, index) => {
    if (parameters.continue && index > 1) {
        return nodeByIndex(index - 1)
    } else if (parameters.await) {
        const node = document.querySelectorAll('#' + parameters.await)[0];
        return node ? addNode(node) : undefined
    }
    return undefined
};

class Honeymate {
    /**
     * Finds all nodes with .honey class and initiate them
     */
    static initiate () {
        const nodes = document.querySelectorAll('.honey');
        for (let i = 0; i < nodes.length; i++) {
            const honeyNode = addNode(nodes[i]);
            const waited = findWaited(honeyNode.parameters, i);
            if (waited) {
                waited.isLoaded().then(() => {
                    setTimeout(
                        () => honeyNode.animate(), honeyNode.parameters.hold
                    );
                });
            } else {
                honeyNode.animate();
            }
        }
    }

    /**
     * Generates HoneyNode from HTMLElement
     * @param {HTMLElement} node source node
     * @returns {HoneyNode}
     */
    static generateNode (node) {
        return new HoneyNode(node)
    }
}

export { Honeymate };
