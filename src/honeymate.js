"use strict";
document.addEventListener("DOMContentLoaded", function() {
  let items = [];
  let exposingItems = [];
  document.querySelectorAll(".honey").forEach(function(img, i) {
    let item = {};
    item.self = img;
    items.push(item);
  });

  items.forEach(function(item, i) {
    let parameters = item.self.dataset;
    item.duration = parameters.duration ? parameters.duration : 640;
    item.effect = parameters.effect ? parameters.effect : "fade";
    item.delay = parameters.delay ? parameters.delay : 0;
    item.hold = parameters.hold ? parameters.hold : 0;
    item.expose = parameters.expose ? parameters.expose : false;
    item.scale = parameters.scale ? parameters.scale : 0.87;
    item.origin = parameters.origin ? parameters.origin : "bottom";
    item.offset =
      parameters.up || parameters.down || parameters.left || parameters.right
        ? parameters.up ||
          parameters.down ||
          parameters.left ||
          parameters.right
        : 32;
    if (parameters.up) item.direction = 1;
    else if (parameters.left) item.direction = 3;
    else if (parameters.right) item.direction = 4;
    else item.direction = 2;
    //Вспомогательный класс, нужен для continue и await;
    item.self.classList.add("is__honeyHidden");
    switch (item.effect) {
      case "relax":
        item.self.style.transform = "scaleY(" + item.scale + ")";
        if (parameters.origin)
          item.self.style.transformOrigin = "center " + item.origin + " 0px";
        else item.self.style.transformOrigin = "center bottom 0px";
        break;
      case "slide":
        switch (item.direction) {
          case 2:
            item.self.style.transform = "translateY(-" + item.offset + "px)";
            break;
          case 3:
            item.self.style.transform = "translateX(" + item.offset + "px)";
            break;
          case 4:
            item.self.style.transform = "translateX(-" + item.offset + "px)";
            break;
          case 1:
          default:
            item.self.style.transform = "translateY(" + item.offset + "px)";
            break;
        }
        break;
      case "zoom":
        item.self.style.transform = "scale(" + item.scale + ")";
        break;
      case "helix":
        item.self.style.transform = "scale(" + item.scale + ") rotate(90deg)";
        break;
    }
    if (parameters.spin) {
      let size = parameters.spinSize ? parameters.spinSize : 36;
      let color = parameters.spinColor ? parameters.spinColor : "#fff";
      let spinner = document.createElement("div");
      spinner.style.position = "absolute";
      spinner.style.width = item.self.offsetWidth + "px";
      spinner.style.height = item.self.offsetHeight + "px";
      spinner.style.transition = "opacity .5s ease-out";
      spinner.style.opacity = 0;
      spinner.style.top = item.self.offsetTop + "px";
      spinner.style.left = item.self.offsetLeft + "px";
      spinner.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;margin:-' +
        size / 2 +
        ';left:50%;top:50%" width="' +
        size +
        '" height="' +
        size +
        '" viewBox="0 0 100 100"><defs><mask id="cut"><rect width="100" height="100" fill="white" /><circle r="44" cx="50" cy="50" fill="black" /><polygon points="50,50 100,25 150,50 100,75" fill="black" style="stransform-origin: 50 50; animation: a 1333ms linear infinite"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1333ms" repeatCount="indefinite"/></polygon></mask></defs><circle r="50" cx="50" cy="50" mask="url(#cut)" /></svg>';
      item.spinner = spinner;
      let parent = item.self.parentNode;
      let next = item.self.nextSibling;
      if (next) {
        parent.insertBefore(item.spinner, next);
      } else {
        parent.appendChild(item.spinner);
      }
      setInterval(function() {
        item.spinner.style.opacity = 1;
      }, 200);
    } else item.spinner = '';

    if (parameters.await || parameters.continue) {
      if (parameters.await) {
        let requested = document.getElementById(parameters.await);
        if (requested != undefined) item.waited = requested;
        else item.waited = false;
      } else if (i > 0) {
        item.waited = items[i - 1].self;
      }
    } else {
      item.waited = false;
    }

    if (parameters.expose) {
      exposingItems.push(i);
    } else {
      if (!item.waited) {
        imagesLoaded(item.self, function() {
          honeymate(i);
        });
      } else {
        let interval = setInterval(function() {
          if (!item.waited.classList.contains("is__honeyHidden")) {
            clearInterval(interval);
            setTimeout(function() {
              imagesLoaded(item.self, function() {
                honeymate(i);
              });
            }, item.hold);
          }
        }, 100);
      }
    }
  });

  window.addEventListener("scroll", expose, false);
  window.addEventListener("resize", expose, false);
  function expose() {
    let scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    let viewportEnd = scrollTop + window.innerHeight;
    exposingItems.forEach(function(index, i) {
      if (items[index].self.offsetTop <= viewportEnd) {
        imagesLoaded(items[index].self, function() {
          honeymate(index);
          exposingItems.splice(i, 1);
        });
      }
    });
  }
  function imagesLoaded(item, fn) {
    let innerItems = item.querySelectorAll("*");
    let imgs = [];
    let computedStyle = getComputedStyle(item);
    if (computedStyle.background != "" || computedStyle.backgroundImage != "") {
      let uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
      if (uri) imgs.push(uri[2]);
    }
    let loadedCount = 0;
    innerItems.forEach(function(item, i) {
      computedStyle = getComputedStyle(item);
      if (item.tagName == "IMG") {
        imgs.push(item.getAttribute("src"));
      } else {
        let uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
        if (uri) imgs.push(uri[2]);
      }
    });
    if (imgs.length == 0) {
      fn();
    } else {
      imgs.forEach(function(img, i) {
        let image = new Image();
        image.onload = function() {
          loadedCount++;
          if (imgs.length == loadedCount) {
            fn();
          }
        };
        image.onerror = image.onload;
        image.src = img;
      });
    }
  }
  function honeymate(index) {
    if(items[index].spinner != ''){
      items[index].spinner.style.top = '-9999px';
      setTimeout(function(){
        items[index].spinner.remove();
      }, 2000)
    }
    setTimeout(function() {
      requestAnimationFrame(function() {
        switch (items[index].effect) {
          case "relax":
            items[index].self.style.transition =
              "opacity " +
              items[index].duration +
              "ms ease-out, transform " +
              items[index].duration +
              "ms cubic-bezier(0, 0, 0.001, 1)";
            items[index].self.style.transform = "scaleY(1)";
            break;
          case "zoom":
            items[index].self.style.transition =
              "opacity " +
              items[index].duration +
              "ms ease-out, transform " +
              items[index].duration +
              "ms cubic-bezier(0, 0.7, 0.3, 1)";
            items[index].self.style.transform = "scale(1)";
            break;
          case "helix":
            items[index].self.style.transition =
              "opacity " +
              items[index].duration +
              "ms ease-out, transform " +
              items[index].duration +
              "ms cubic-bezier(0, 0.75, 0.25, 1)";
            items[index].self.style.transform = "scale(1) rotate(0deg)";
            break;
          case "slide":
            items[index].self.style.transition =
              "opacity " +
              items[index].duration +
              "ms ease-out, transform " +
              items[index].duration +
              "ms cubic-bezier(0, 0.9, 0.1, 1)";
            items[index].self.style.opacity = "";
            items[index].self.style.transform = "translate(0)";
            break;
          default:
            items[index].self.style.transition =
              "opacity " + items[index].duration + "ms ease-out";
            break;
        }
        items[index].self.style.opacity = "1";
      });
      items[index].self.classList.remove("is__honeyHidden");
    }, items[index].delay);
    setTimeout(function() {
      items[index].self.style.transition = "";
      items[index].self.style.transform = "";
      items[index].self.style.transformOrigin = "";
    }, items[index].duration + items[index].delay + 30);
  }
});
document.write("<style>.honey{opacity:0}</style>");
