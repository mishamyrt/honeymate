!function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}var r=function(e,t){return new Promise(function(n){for(var r in t)e.style[r]=t[r];n()})},i=function(e,t){t.opacity="ease-out";var n="";return Object.keys(t).forEach(function(r){n+="".concat(r," ").concat(e,"ms ").concat(t[r],", ")}),n.substring(0,n.length-2)},o=/url\(\s*(['"]?)(.*)\1\s*\)/,a=function(e){var t=getComputedStyle(e);if(""!==t.background||""!==t.backgroundImage){var n=t.background.match(o);return n?n[2]:""}return""},s=function(e){return new Promise(function(t){var n=Array.from(e.querySelectorAll("*"));n.push(e);var r=function(e){for(var t=[],n=0;n<e.length;n++)if("IMG"===e[n].tagName)t.push(e[n].src);else{var r=a(e[n]);r&&t.push(r)}return t}(n);if(0===r.length)t(0);else{var i=[];r.forEach(function(e){i.push(function(e){return new Promise(function(t){var n=new Image;n.onload=t,n.onerror=t,n.src=e})}(e))}),Promise.all(i).then(function(){t(r.length)})}})},c=function(){function t(n){e(this,t),n.style.opacity=0,this.node=n,this.node.classList.add("honey_ready"),this.options=n.dataset}return n(t,[{key:"isLoaded",value:function(){var e=this;return new Promise(function(t){s(e.node).then(function(){return setTimeout(function(){return t()},e.parameters.hold)})})}},{key:"animate",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.effect;r(this.node,t).then(function(){e.isLoaded().then(function(){setTimeout(function(){e.expose()},e.parameters.delay)})})}},{key:"expose",value:function(){var e=this;r(this.node,{transform:"",opacity:1}).then(function(){var t;e.parameters.spin&&(t=e.spinner,requestAnimationFrame(function(){t.style.opacity=0,setTimeout(function(){document.body.removeChild(t)},500)}))})}},{key:"options",set:function(e){var t,n,o,a,s,c,u,f;this.parameters={direction:function(e){return e.right?2:e.down?3:e.left?4:1}(t=e),duration:t.duration||"640",effect:t.effect||"fade",delay:parseInt(t.delay,10)||0,hold:parseInt(t.hold,10)||0,scale:t.scale||".87",await:t.await||null,origin:t.origin||"bottom",offset:t.up||t.down||t.left||t.right?t.up||t.down||t.left||t.right:32,spin:"true"===t.spin,spinColor:t["spin-color"]||"#000",spinSize:t["spin-size"]||"24",continue:"true"===t.continue},this.effect=function(e){var t,n,r,o=e.duration,a={};switch(e.effect){case"zoom":a.transition=i(o,{transform:"cubic-bezier(0,.7,.3,1)"}),a.transform="scale(".concat(e.scale,")");break;case"helix":a.transition=i(o,{transform:"cubic-bezier(0,.75,.25,1)"}),a.transform="scale(".concat(e.scale,") rotate(90deg)");break;case"slide":a.transition=i(o,{transform:"cubic-bezier(0,.9,.1,1)"}),a.transform=(t=e.direction,n=e.offset,r=1===t||3===t?"Y":"X","translate".concat(r+=1===t||2===t?"(-":"(").concat(n,"px)")),a.transformOrigin=e.origin;break;case"relax":a.transition=i(o,{transform:"cubic-bezier(0,0,.001,1)"}),a.transform="scaleY(".concat(e.scale,")"),a.transformOrigin=e.origin;break;default:a.transition=i(o,{})}return a}(this.parameters),this.parameters.spin&&(this.spinner=(s=(n=this).node,c=s.getBoundingClientRect(),u=document.createElement("div"),f=document.documentElement,u.innerHTML=(o=n.parameters.spinSize,a=n.parameters.spinColor,'<svg width="'.concat(o,'" height="').concat(o,'" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="').concat(a,'" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>')),r(u,{position:"absolute",top:c.top+f.scrollTop+"px",left:c.left+f.scrollLeft+"px",width:s.offsetWidth+"px",height:s.offsetHeight+"px",display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .23s ease-out"}).then(function(){return document.body.appendChild(u)}),u))},get:function(){return this.parameters}}]),t}(),u=new Map,f=function(e){if(u.has(e))return u.get(e);var t=new c(e);return u.set(e,t),t},l=function(e,t){if(e.continue&&t>1)return function(e){return u.get(Array.from(u.keys())[e])}(t-1);if(e.await){var n=document.querySelectorAll("#"+e.await)[0];return n?f(n):-1}return-1},d=function(){function t(){e(this,t)}return n(t,null,[{key:"initiate",value:function(){for(var e=document.querySelectorAll(".honey"),t=function(t){var n=f(e[t]),r=l(n.parameters,t);-1===r?n.animate():r.isLoaded().then(function(){setTimeout(function(){return n.animate()},n.parameters.hold)})},n=0;n<e.length;n++)t(n)}},{key:"generateNode",value:function(e){return new c(e)}}]),t}();window.Honeymate=d,document.addEventListener("DOMContentLoaded",d.initiate),document.write("<style>.honey{opacity:0}@keyframes honeySpin{0%{transform:rotate(-360deg)}to{transform:rotate(360deg)}}</style>")}();
