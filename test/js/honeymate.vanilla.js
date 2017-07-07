/*!
 * imagesLoaded PACKAGED v4.1.2
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}("undefined"!=typeof window?window:this,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});

'use strict';
function readyforhoneymate() {
  function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }
  function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }
  var spinnerInDocument = false;
  var items = document.querySelectorAll('.honey');
  Array.prototype.forEach.call(items, function(cur, i) {
    //задаём базовые параметры
    var duration = 640;
    var effect = 'fade';
    var delay = 0;
    var scale = 0.92;
    var defaultscale = true;
    var origin = 'bottom';
    var spin = false;
    var hold = 0;
    var direction = null;
    var offset = 32;
    var position = cur.getBoundingClientRect();
    //читаем и задаём параметры из data–атрибутов
    var parameters = cur.dataset;
    if (parameters.duration) duration = parameters.duration;
    if (parameters.effect) effect = parameters.effect;
    if (parameters.delay) delay = parameters.delay;
    if (parameters.hold) hold = parameters.hold;
    if (parameters.scale) {
      scale = parameters.scale;
      defaultscale = false;
    }
    if (
      parameters.up ||
      parameters.down ||
      parameters.left ||
      parameters.right
    ) {
      offset =
        parameters.up || parameters.down || parameters.left || parameters.right;
    }
    if (parameters.up) direction = 1;
    if (parameters.down) direction = 2;
    if (parameters.left) direction = 3;
    if (parameters.right) direction = 4;
    cur.className += ' honeyhidden'; //Вспомогательный класс, нужен для continue и await;
    cur.style.opacity = '0';

    //Специфичные подготовки для анимаций
    switch (parameters.effect) {
      case 'relax':
        cur.style.transform = 'scaleY(' + scale + ')';
        if (parameters.origin)
          cur.style.transformOrigin = 'center ' + origin + ' 0px';
        else cur.style.transformOrigin = 'center bottom 0px';
        break;
      case 'slide':
        switch (direction) {
          case 2:
            cur.style.transform = 'translateY(-' + offset + 'px)';
            break;
          case 3:
            cur.style.transform = 'translateX(' + offset + 'px)';
            break;
          case 4:
            cur.style.transform = 'translateX(-' + offset + 'px)';
            break;
          case 1:
          default:
            cur.style.transform = 'translateY(' + offset + 'px)';
            break;
        }
        break;
      case 'zoom':
        if (defaultscale) cur.style.transform = 'scale(0.6)';
        else cur.style.transform = 'scale(' + scale + ')';
        break;

      case 'helix':
        if (defaultscale) cur.style.transform = 'scale(0.6) rotate(90deg)';
        else cur.style.transform = 'scale(' + scale + ') rotate(90deg)';
        break;
    }
    if (parameters.spin) {

    }
    if (parameters.expose) {
      exposeCheck();
      window.addEventListener('scroll', exposeCheck, false);
    } else {
      gotoanimation();
    }

    function exposeCheck() {
      if (hasClass(cur, 'honey')) {
        var scrolled = window.pageYOffset + window.innerHeight;
        var _position = cur.getBoundingClientRect().top + window.pageYOffset;
        if (scrolled >= _position) {
          gotoanimation();
        }
      }
    }
    function gotoanimation() {
      if (parameters.await || parameters.continue) {
        var waited = null;
        if (parameters.continue) {
          waited = items[i - 1];
        } else waited = document.getElementById(parameters.await);
        var interval = setInterval(function() {
          if (hasClass(waited, 'honeyhidden')) return;
          clearInterval(interval);
          imagesLoaded(cur, { background: true }, function(instance) {
            setTimeout(function() {
              honeymate(cur, duration, delay, effect, spin);
            }, hold);
          });
        }, 0.01);
      } else {
        imagesLoaded(cur, { background: true }, function(instance) {
          honeymate(cur, duration, delay, effect, spin);
        });
      }
    }
  });
  function honeymate(cur, duration, delay, effect, spin) {
    setTimeout(function() {
      //Показываем
      switch (effect) {
        case 'relax':
          cur.style.transition =
            'opacity ' +
            duration +
            'ms ease-out, transform ' +
            duration +
            'ms cubic-bezier(0, 0, 0.001, 1)';
          cur.style.opacity = 1;
          cur.style.transform = 'scaleY(1)';
          break;
        case 'zoom':
          cur.style.transition =
            'opacity ' +
            duration +
            'ms ease-out, transform ' +
            duration +
            'ms cubic-bezier(0, 0.7, 0.3, 1)';
          cur.style.opacity = '1';
          cur.style.transform = 'scale(1)';
          break;
        case 'helix':
          cur.style.transition =
            'opacity ' +
            duration +
            'ms ease-out, transform ' +
            duration +
            'ms cubic-bezier(0, 0.75, 0.25, 1)';
          cur.style.opacity = '1';
          cur.style.transform = 'scale(1) rotate(0deg)';
          break;
        case 'slide':
          cur.style.transition =
            'opacity ' +
            duration +
            'ms ease-out, transform ' +
            duration +
            'ms cubic-bezier(0, 0.9, 0.1, 1)';
          cur.style.opacity = '1';
          cur.style.transform = 'translate(0)';
          break;
        default:
          cur.style.transition = 'opacity ' + duration + 'ms ease-out';
          cur.style.opacity = '1';
          break;
      }
    }, delay);
    if (spin) {
      cur.previousElementSibling.style.display = 'none';
    }
    removeClass(cur, 'honeyhidden');
    setTimeout(function() {
      cur.style.transition = '';
      cur.style.transform = '';
    }, duration + delay + 10);
  }
}
document.write('<style>.honey{opacity: 0}</style>');
document.addEventListener('DOMContentLoaded', readyforhoneymate);
