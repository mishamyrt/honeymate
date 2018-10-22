define(function () { 'use strict';

    var generateTransition = function generateTransition(duration, properties) {
        properties.opacity = 'ease-out';
        var transitionString = '';
        Object.keys(properties).forEach(function (key) {
            transitionString += key + ' ' + duration + 'ms ' + properties[key] + ', ';
        });
        return transitionString.substring(0, transitionString.length - 2);
    };

    var generateSlide = function generateSlide(direction, offset) {
        var transformString = direction === 1 || direction === 3 ? 'Y' : 'X';
        transformString += direction === 1 || direction === 2 ? '(-' : '(';
        return 'translate' + transformString + offset + 'px)';
    };

    var generateEffect = function generateEffect(parameters) {
        var duration = parameters.duration;
        var effect = {};
        switch (parameters.effect) {
            case 'zoom':
                effect.transition = generateTransition(duration, {
                    transform: 'cubic-bezier(0, 0.7, 0.3, 1)'
                });
                effect.transform = 'scale(' + parameters.scale + ')';
                break;
            case 'helix':
                effect.transition = generateTransition(duration, {
                    transform: 'cubic-bezier(0, 0.75, 0.25, 1)'
                });
                effect.transform = 'scale(' + parameters.scale + ') rotate(90deg)';
                break;
            case 'slide':
                effect.transition = generateTransition(duration, {
                    transform: 'cubic-bezier(0, 0.9, 0.1, 1)'
                });
                effect.transform = generateSlide(parameters.direction, parameters.offset);
                effect.transformOrigin = parameters.origin;
                break;
            case 'relax':
                effect.transition = generateTransition(duration, {
                    transform: 'cubic-bezier(0, 0, 0.001, 1)'
                });
                effect.transform = 'scaleY(' + parameters.scale + ')';
                effect.transformOrigin = parameters.origin;
                break;
            default:
            case 'fade':
                effect.transition = generateTransition(duration, {});
        }
        return effect;
    };

    var bgRegex = /url\(\s*(['"]?)(.*)\1\s*\)/;

    var getBackgroundImage = function getBackgroundImage(node) {
        var style = getComputedStyle(node);
        if (style.background !== '' || style.backgroundImage !== '') {
            var uri = style.background.match(bgRegex);
            return uri ? uri[2] : '';
        }
        return '';
    };

    var waitForImage = function waitForImage(url) {
        return new Promise(function (resolve) {
            var image = new Image();
            image.onload = resolve;
            image.onerror = resolve;
            image.src = url;
        });
    };

    var getImagesUrl = function getImagesUrl(nodes) {
        var images = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var node = _step.value;

                if (node.tagName === 'IMG') {
                    images.push(node.getAttribute('src'));
                } else {
                    var url = getBackgroundImage(node);
                    if (url) {
                        images.push(url);
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return images;
    };

    var waitImages = function waitImages(node) {
        return new Promise(function (resolve) {
            var checkableNodes = Array.from(node.querySelectorAll('*'));
            checkableNodes.push(node);
            var images = getImagesUrl(checkableNodes);
            if (images.length === 0) {
                resolve(0);
            } else {
                var promises = [];
                images.forEach(function (url) {
                    promises.push(waitForImage(url));
                });
                Promise.all(promises).then(function () {
                    resolve(images.length);
                });
            }
        });
    };

    var getDirection = function getDirection(dataset) {
        if (dataset.right) {
            return 2;
        } else if (dataset.down) {
            return 3;
        } else if (dataset.left) {
            return 4;
        } else {
            return 1;
        }
    };

    var parseParameters = function parseParameters(dataset) {
        return {
            direction: getDirection(dataset),
            duration: dataset.duration ? dataset.duration : 640,
            effect: dataset.effect ? dataset.effect : 'fade',
            expose: dataset.expose ? dataset.expose === 'true' : false,
            delay: dataset.delay ? parseInt(dataset.delay, 10) : 0,
            hold: dataset.hold ? parseInt(dataset.hold, 10) : 0,
            scale: dataset.scale ? dataset.scale : 0.87,
            await: dataset.await ? dataset.await : null,
            'continue': dataset.continue === 'true',
            origin: dataset.origin ? dataset.origin : 'bottom',
            offset: dataset.up || dataset.down || dataset.left || dataset.right ? dataset.up || dataset.down || dataset.left || dataset.right : 32
        };
    };

    var HoneyNode = function () {
        function HoneyNode(node) {
            babelHelpers.classCallCheck(this, HoneyNode);

            node.style.opacity = 0;
            this.node = node;
            this.setParameters(node.dataset);
        }

        babelHelpers.createClass(HoneyNode, [{
            key: 'setParameters',
            value: function setParameters(parameters) {
                this.parameters = parseParameters(parameters);
                this.effect = generateEffect(this.parameters);
            }
        }, {
            key: 'applyEffect',
            value: function applyEffect(effect) {
                var _this = this;

                return new Promise(function (resolve) {
                    var count = 0;
                    for (var key in effect) {
                        _this.node.style[key] = effect[key];
                        count++;
                    }
                    resolve(count);
                });
            }
        }, {
            key: 'isLoaded',
            value: function isLoaded() {
                var _this2 = this;

                return new Promise(function (resolve) {
                    waitImages(_this2.node).then(function () {
                        return setTimeout(function () {
                            return resolve();
                        }, _this2.parameters.hold);
                    });
                });
            }
        }, {
            key: 'animate',
            value: function animate() {
                var _this3 = this;

                var effect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.effect;

                this.applyEffect(effect).then(function () {
                    _this3.isLoaded().then(function () {
                        setTimeout(function () {
                            _this3.expose();
                        }, _this3.parameters.delay);
                    });
                });
            }
        }, {
            key: 'expose',
            value: function expose() {
                this.applyEffect({
                    transform: '',
                    opacity: 1
                });
            }
        }]);
        return HoneyNode;
    }();

    var honeyNodes = new Map();

    var nodeByIndex = function nodeByIndex(i) {
        return honeyNodes.get(Array.from(honeyNodes.keys())[i]);
    };

    var addNode = function addNode(node) {
        if (honeyNodes.has(node)) {
            return honeyNodes[node];
        }
        var honeyNode = new HoneyNode(node);
        honeyNodes.set(node, honeyNode);
        return honeyNode;
    };

    var findWaited = function findWaited(parameters, i) {
        if (parameters.continue && i > 1) {
            return nodeByIndex(i - 1);
        } else if (parameters.await) {
            var node = document.getElementById(parameters.await);
            if (node) {
                return addNode(node);
            }
        }
        return -1;
    };

    var Honeymate = function () {
        function Honeymate() {
            babelHelpers.classCallCheck(this, Honeymate);
        }

        babelHelpers.createClass(Honeymate, null, [{
            key: 'initiate',
            value: function initiate() {
                var nodes = document.querySelectorAll('.honey');

                var _loop = function _loop(i) {
                    var honeyNode = addNode(nodes[i]);
                    var waited = findWaited(honeyNode.parameters, i);
                    if (waited === -1) {
                        honeyNode.animate();
                    } else {
                        waited.isLoaded().then(function () {
                            setTimeout(function () {
                                honeyNode.animate();
                            }, honeyNode.parameters.hold);
                        });
                    }
                };

                for (var i = 0; i < nodes.length; i++) {
                    _loop(i);
                }
            }
        }, {
            key: 'generateNode',
            value: function generateNode(node) {
                return new HoneyNode(node);
            }
        }]);
        return Honeymate;
    }();

    return Honeymate;

});
