"use strict";
document.addEventListener("DOMContentLoaded", function() {
  let items = document.querySelectorAll(".honey");
  let exposingItems = [];
  Array.prototype.forEach.call(items, function(item, i) {
    //читаем и задаём параметры из data–атрибутов
    let parameters = item.dataset;
    let duration = parameters.duration ? parameters.duration : 640;
    let effect = parameters.effect ? parameters.effect : "fade";
    let delay = parameters.delay ? parameters.delay : 0;
    let hold = parameters.hold ? parameters.hold : 0;
    let expose = parameters.expose ? parameters.expose : false;
    let scale = parameters.scale ? parameters.scale : 0.92;
    let origin = parameters.origin ? parameters.origin : "bottom";
    let offset =
      parameters.up || parameters.down || parameters.left || parameters.right
        ? parameters.up ||
          parameters.down ||
          parameters.left ||
          parameters.right
        : 32;
    let direction = null;
    if (parameters.up) direction = 1;
    else if (parameters.down) direction = 2;
    else if (parameters.left) direction = 3;
    else if (parameters.right) direction = 4;
    //Вспомогательный класс, нужен для continue и await;
    item.classList.add("is__honeyHidden");

    //Специфичные подготовки для анимаций
    switch (parameters.effect) {
      case "relax":
        item.style.transform = "scaleY(" + scale + ")";
        if (parameters.origin)
          item.style.transformOrigin = "center " + origin + " 0px";
        else item.style.transformOrigin = "center bottom 0px";
        break;
      case "slide":
        switch (direction) {
          case 2:
            item.style.transform = "translateY(-" + offset + "px)";
            break;
          case 3:
            item.style.transform = "translateX(" + offset + "px)";
            break;
          case 4:
            item.style.transform = "translateX(-" + offset + "px)";
            break;
          case 1:
          default:
            item.style.transform = "translateY(" + offset + "px)";
            break;
        }
        break;
      case "zoom":
        if (defaultscale) item.style.transform = "scale(0.6)";
        else item.style.transform = "scale(" + scale + ")";
        break;
      case "helix":
        if (defaultscale) item.style.transform = "scale(0.6) rotate(90deg)";
        else item.style.transform = "scale(" + scale + ") rotate(90deg)";
        break;
    }
    if (parameters.expose) {
      let exposedItem = {};
      exposedItem.self = item;
      exposedItem.duration = duration;
      exposedItem.delay = delay;
      exposedItem.effect = effect;
      exposingItems.push(exposedItem);
    } else if (parameters.await || parameters.continue) {
      let waited;
      if (parameters.await) {
        waited = document.getElementById(parameters.await);
      } else {
        waited = items[i - 1];
      }
      if (waited != undefined) {
        let interval = setInterval(function() {
          if (!waited.classList.contains("is__honeyHidden")) {
            imagesLoaded(item, function() {
              setTimeout(function() {
                imagesLoaded(item, function() {
                  honeymate(item, duration, delay, effect);
                });
              }, hold);
              clearInterval(interval);
            });
          }
        }, 0.01);
      } else {
        imagesLoaded(item, function() {
          honeymate(item, duration, delay, effect);
        });
      }
    } else {
      imagesLoaded(item, function() {
        honeymate(item, duration, delay, effect);
      });
    }
  });
  window.addEventListener(
    "scroll",
    function() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      let viewportEnd = scrollTop + window.innerHeight;
      Array.prototype.forEach.call(exposingItems, function(item, i) {
        if (item.self.getBoundingClientRect().top + scrollTop <= viewportEnd) {
          imagesLoaded(item.self, function() {
            honeymate(item.self, item.duration, item.delay, item.effect);
            exposingItems.splice(i, 1);
            // console.log(exposingItems);
          });
        }
      });
    },
    false
  );
  function imagesLoaded(item, fn) {
    let innerItems = item.querySelectorAll("*");
    let imgs = [];
    let computedStyle = getComputedStyle(item);
    if (computedStyle.background != "" || computedStyle.backgroundImage != "") {
      let uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
      if (uri)
        imgs.push(uri[2]);
    }
    let loadedCount = 0;
    //собираем все картинки
    Array.prototype.forEach.call(innerItems, function(item, i) {
      computedStyle = getComputedStyle(item);
      if (item.tagName == "IMG") {
        imgs.push(item.getAttribute("src"));
      } else {
        let uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
        if (uri)
          imgs.push(uri[2]);
      }
    });
    
    if (imgs.length == 0){
      fn();
    }
    else{
      imgs.forEach(function(img, i) {
      // console.log(img);
      let image = new Image();
      image.onload = function() {
        loadedCount++;
        if (imgs.length == loadedCount) {
          fn();
        }
      };
      image.onerror = image.onload;
      // image.onerror = image.onload;
      image.src = img;
    });
    }
  }
  function honeymate(item, duration, delay, effect, expose) {
    setTimeout(function() {
      //Показываем через запрос кадра
      requestAnimationFrame(function() {
        switch (effect) {
          case "relax":
            item.style.transition =
              "opacity " +
              duration +
              "ms ease-out, transform " +
              duration +
              "ms cubic-bezier(0, 0, 0.001, 1)";
            item.style.transform = "scaleY(1)";
            break;
          case "zoom":
            item.style.transition =
              "opacity " +
              duration +
              "ms ease-out, transform " +
              duration +
              "ms cubic-bezier(0, 0.7, 0.3, 1)";
            item.style.transform = "scale(1)";
            break;
          case "helix":
            item.style.transition =
              "opacity " +
              duration +
              "ms ease-out, transform " +
              duration +
              "ms cubic-bezier(0, 0.75, 0.25, 1)";
            item.style.transform = "scale(1) rotate(0deg)";
            break;
          case "slide":
            item.style.transition =
              "opacity " +
              duration +
              "ms ease-out, transform " +
              duration +
              "ms cubic-bezier(0, 0.9, 0.1, 1)";
            item.style.opacity = "";
            item.style.transform = "translate(0)";
            break;
          default:
            item.style.transition = "opacity " + duration + "ms ease-out";
            break;
        }
        item.style.opacity = "1";
      });
    }, delay);
    item.classList.remove("is__honeyHidden");
    setTimeout(function() {
      item.style.transition = "";
      item.style.transform = "";
      item.style.transformOrigin = "";
    }, duration + delay + 30);
  }
});
document.write('<style>.honey{opacity:0}</style>');