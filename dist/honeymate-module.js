'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const applyStyle = (node, style) => {
    return new Promise((resolve) => {
        for (const key in style) {
            node.style[key] = style[key];
        }
        resolve();
    })
};

const getSpinner = (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="${color}" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>`;

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

const removeSpinner = (spinNode) => {
    requestAnimationFrame(() => {
        spinNode.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(spinNode);
        }, 500);
    });
};

const generateTransition = (duration, properties) => {
    properties.opacity = 'ease-out';
    let transitionString = '';
    Object.keys(properties).forEach((key) => {
        transitionString += `${key} ${duration}ms ${properties[key]}, `;
    });
    return transitionString.substring(0, transitionString.length - 2)
};

const generateSlide = (direction, offset) => {
    let transformString = direction === 1 || direction === 3 ? 'Y' : 'X';
    transformString += direction === 1 || direction === 2 ? '(-' : '(';
    return `translate${transformString}${offset}px)`
};

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
                    transform: 'cubic-bezier(0,0,.001,1)',
                });
            effect.transform = `scaleY(${parameters.scale})`;
            effect.transformOrigin = parameters.origin;
            break
        default:
            effect.transition = generateTransition(duration, { });
    }
    return effect
};

const bgRegex = /url\(\s*(['"]?)(.*)\1\s*\)/;

const getBackgroundImage = (node) => {
    const style = getComputedStyle(node);
    if (style.background !== '' || style.backgroundImage !== '') {
        const uri = style.background.match(bgRegex);
        return uri ? uri[2] : ''
    }
    return ''
};

const waitForImage = (url) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = url;
    })
};

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
    constructor (node) {
        node.style.opacity = 0;
        this.node = node;
        this.node.classList.add('honey_ready');
        this.options = node.dataset;
    }

    set options (options) {
        this.parameters = parseParameters(options);
        this.effect = generateEffect(this.parameters);
        if (this.parameters.spin) {
            this.spinner = generateSpinner(this);
        }
    }

    get options () {
        return this.parameters
    }

    isLoaded () {
        return new Promise((resolve) => {
            waitImages(this.node).then(
                () => setTimeout(
                    () => resolve(), this.parameters.hold
                )
            );
        })
    }

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

const nodeByIndex = (i) => honeyNodes.get(Array.from(honeyNodes.keys())[i]);

const addNode = (node) => {
    if (honeyNodes.has(node)) {
        return honeyNodes.get(node)
    }
    const honeyNode = new HoneyNode(node);
    honeyNodes.set(node, honeyNode);
    return honeyNode
};

const findWaited = (parameters, i) => {
    if (parameters.continue && i > 1) {
        return nodeByIndex(i - 1)
    } else if (parameters.await) {
        const node = document.querySelectorAll('#' + parameters.await)[0];
        return node ? addNode(node) : undefined
    }
    return undefined
};

class Honeymate {
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
    static generateNode (node) {
        return new HoneyNode(node)
    }
}

exports.Honeymate = Honeymate;
