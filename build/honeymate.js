(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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
      duration: dataset.duration || '640',
      effect: dataset.effect || 'fade',
      delay: parseInt(dataset.delay, 10) || 0,
      hold: parseInt(dataset.hold, 10) || 0,
      scale: dataset.scale || '.87',
      await: dataset.await || null,
      origin: dataset.origin || 'bottom',
      offset: dataset.up || dataset.down || dataset.left || dataset.right ? dataset.up || dataset.down || dataset.left || dataset.right : 32,
      spin: dataset.spin === 'true',
      spinColor: dataset['spin-color'] || '#000',
      spinSize: dataset['spin-size'] || '24',
      'continue': dataset.continue === 'true'
    };
  };
  var applyStyle = function applyStyle(node, style) {
    return new Promise(function (resolve) {
      for (var key in style) {
        node.style[key] = style[key];
      }

      resolve();
    });
  };
  var getSpinnerSVG = function getSpinnerSVG(size, color) {
    return "<svg width=\"".concat(size, "\" height=\"").concat(size, "\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" style=\"animation: honeySpin 1.7s linear infinite\"><circle cx=\"50\" cy=\"50\" fill=\"none\" stroke=\"").concat(color, "\" stroke-width=\"10\" r=\"35\" stroke-dasharray=\"90 60\"></circle></svg>");
  };

  var generateSpinner = function generateSpinner(honeyNode) {
    var node = honeyNode.node;
    var rect = node.getBoundingClientRect();
    var spinNode = document.createElement('div');
    var element = document.documentElement;
    spinNode.innerHTML = getSpinnerSVG(honeyNode.parameters.spinSize, honeyNode.parameters.spinColor);
    applyStyle(spinNode, {
      position: 'absolute',
      top: rect.top + element.scrollTop + 'px',
      left: rect.left + element.scrollLeft + 'px',
      width: node.offsetWidth + 'px',
      height: node.offsetHeight + 'px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity .23s ease-out'
    }).then(function () {
      return document.body.appendChild(spinNode);
    });
    return spinNode;
  };
  var removeSpinner = function removeSpinner(spinNode) {
    requestAnimationFrame(function () {
      spinNode.style.opacity = 0;
      setTimeout(function () {
        document.body.removeChild(spinNode);
      }, 500);
    });
  };

  var generateTransition = function generateTransition(duration, properties) {
    properties.opacity = 'ease-out';
    var transitionString = '';
    Object.keys(properties).forEach(function (key) {
      transitionString += "".concat(key, " ").concat(duration, "ms ").concat(properties[key], ", ");
    });
    return transitionString.substring(0, transitionString.length - 2);
  };

  var generateSlide = function generateSlide(direction, offset) {
    var transformString = direction === 1 || direction === 3 ? 'Y' : 'X';
    transformString += direction === 1 || direction === 2 ? '(-' : '(';
    return "translate".concat(transformString).concat(offset, "px)");
  };

  var generateEffect = function generateEffect(parameters) {
    var duration = parameters.duration;
    var effect = {};

    switch (parameters.effect) {
      case 'zoom':
        effect.transition = generateTransition(duration, {
          transform: 'cubic-bezier(0,.7,.3,1)'
        });
        effect.transform = "scale(".concat(parameters.scale, ")");
        break;

      case 'helix':
        effect.transition = generateTransition(duration, {
          transform: 'cubic-bezier(0,.75,.25,1)'
        });
        effect.transform = "scale(".concat(parameters.scale, ") rotate(90deg)");
        break;

      case 'slide':
        effect.transition = generateTransition(duration, {
          transform: 'cubic-bezier(0,.9,.1,1)'
        });
        effect.transform = generateSlide(parameters.direction, parameters.offset);
        effect.transformOrigin = parameters.origin;
        break;

      case 'relax':
        effect.transition = generateTransition(duration, {
          transform: 'cubic-bezier(0,0,.001,1)'
        });
        effect.transform = "scaleY(".concat(parameters.scale, ")");
        effect.transformOrigin = parameters.origin;
        break;

      default:
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
        if (!_iteratorNormalCompletion && _iterator.return != null) {
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

  var HoneyNode =
  /*#__PURE__*/
  function () {
    function HoneyNode(node) {
      _classCallCheck(this, HoneyNode);

      node.style.opacity = 0;
      this.node = node;
      this.node.classList.add('honey_ready');
      this.options = node.dataset;
    }

    _createClass(HoneyNode, [{
      key: "isLoaded",
      value: function isLoaded() {
        var _this = this;

        return new Promise(function (resolve) {
          waitImages(_this.node).then(function () {
            return setTimeout(function () {
              return resolve();
            }, _this.parameters.hold);
          });
        });
      }
    }, {
      key: "animate",
      value: function animate() {
        var _this2 = this;

        var effect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.effect;
        applyStyle(this.node, effect).then(function () {
          _this2.isLoaded().then(function () {
            setTimeout(function () {
              _this2.expose();
            }, _this2.parameters.delay);
          });
        });
      }
    }, {
      key: "expose",
      value: function expose() {
        var _this3 = this;

        applyStyle(this.node, {
          transform: '',
          opacity: 1
        }).then(function () {
          if (_this3.parameters.spin) {
            removeSpinner(_this3.spinner);
          }
        });
      }
    }, {
      key: "options",
      set: function set(options) {
        this.parameters = parseParameters(options);
        this.effect = generateEffect(this.parameters);

        if (this.parameters.spin) {
          this.spinner = generateSpinner(this);
        }
      },
      get: function get() {
        return this.parameters;
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
      return honeyNodes.get(node);
    }

    var honeyNode = new HoneyNode(node);
    honeyNodes.set(node, honeyNode);
    return honeyNode;
  };

  var findWaited = function findWaited(parameters, i) {
    if (parameters.continue && i > 1) {
      return nodeByIndex(i - 1);
    } else if (parameters.await) {
      var node = document.querySelectorAll('#' + parameters.await)[0];
      return node ? addNode(node) : -1;
    }

    return -1;
  };

  var Honeymate =
  /*#__PURE__*/
  function () {
    function Honeymate() {
      _classCallCheck(this, Honeymate);
    }

    _createClass(Honeymate, null, [{
      key: "initiate",
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
                return honeyNode.animate();
              }, honeyNode.parameters.hold);
            });
          }
        };

        for (var i = 0; i < nodes.length; i++) {
          _loop(i);
        }
      }
    }, {
      key: "generateNode",
      value: function generateNode(node) {
        return new HoneyNode(node);
      }
    }]);

    return Honeymate;
  }();

  window.Honeymate = Honeymate;
  document.addEventListener('DOMContentLoaded', Honeymate.initiate);
  document.write('<style>.honey{opacity:0}@keyframes honeySpin{0%{transform:rotate(-360deg)}to{transform:rotate(360deg)}}</style>');

}());
