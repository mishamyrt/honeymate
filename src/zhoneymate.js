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
