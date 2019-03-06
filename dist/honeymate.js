!function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}var r=function(e){return e.right?2:e.down?3:e.left?4:1},i=function(e,t){return new Promise(function(n){for(var r in t)e.style[r]=t[r];n(e)})},o=function(e,t){t.opacity="ease-out";var n="";return Object.keys(t).forEach(function(r){n+="".concat(r," ").concat(e,"ms ").concat(t[r],", ")}),n.substring(0,n.length-2)},a=/url\(\s*(['"]?)(.*)\1\s*\)/,s=function(e){var t=getComputedStyle(e);if(t.background&&""!==t.background){var n=t.background.match(a);return n?n[2]:""}if(t.backgroundImage&&""!==t.backgroundImage){var r=t.backgroundImage.match(a);return r?r[2]:""}},c=function(e){return new Promise(function(t){var n=Array.from(e.querySelectorAll("*"));n.push(e);var r=function(e){for(var t=[],n=0;n<e.length;n++)if("IMG"===e[n].tagName)t.push(e[n].src);else{var r=s(e[n]);r&&t.push(r)}return t}(n);if(0===r.length)t();else{var i=[];r.forEach(function(e){i.push(function(e){return new Promise(function(t){var n=new Image;n.onload=t,n.onerror=t,n.src=e})}(e))}),Promise.all(i).then(t)}})},u=function(){function t(n){e(this,t),n.style.opacity=0,this.node=n,this.node.classList.add("honey_ready"),this.options=n.dataset}return n(t,[{key:"isLoaded",value:function(){var e=this;return new Promise(function(t){c(e.node).then(function(){return setTimeout(function(){return t()},e.parameters.hold)})})}},{key:"isInView",value:function(){var e=this;return new Promise(function(t){var n=new IntersectionObserver(function(e){e[0].isIntersecting&&e[0].time>70&&(t(),n.disconnect())});n.observe(e.node)})}},{key:"animate",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.effect;i(this.node,t).then(function(){Promise.all([e.parameters.expose?e.isInView():null,e.isLoaded()]).then(function(){setTimeout(function(){return e.expose()},e.parameters.delay)})})}},{key:"expose",value:function(){var e=this;i(this.node,{transform:"",opacity:1}).then(function(){var t;e.parameters.spin&&(t=e.spinner,requestAnimationFrame(function(){t.style.opacity=0,setTimeout(function(){document.body.removeChild(t)},500)}))})}},{key:"options",set:function(e){var t,n,a,s,c,u,f,l;this.parameters={direction:r(t=e),duration:t.duration||640,effect:t.effect||"",expose:"true"===t.expose&&"IntersectionObserver"in window,delay:parseInt(t.delay,10)||0,hold:parseInt(t.hold,10)||0,scale:t.scale||".87",await:t.await||null,origin:t.origin||"bottom",offset:t.up||t.down||t.left||t.right?t.up||t.down||t.left||t.right:32,spin:"true"===t.spin,spinColor:t["spin-color"]||"#000",spinSize:t["spin-size"]||24,continue:"true"===t.continue},this.effect=function(e){var t,n,r,i=e.duration,a={};switch(e.effect){case"zoom":a.transition=o(i,{transform:"cubic-bezier(0,.7,.3,1)"}),a.transform="scale(".concat(e.scale,")");break;case"helix":a.transition=o(i,{transform:"cubic-bezier(0,.75,.25,1)"}),a.transform="scale(".concat(e.scale,") rotate(90deg)");break;case"slide":a.transition=o(i,{transform:"cubic-bezier(0,.9,.1,1)"}),a.transform=(t=e.direction,n=e.offset,r=1===t||3===t?"Y":"X","translate".concat(r+=1===t||2===t?"(-":"(").concat(n,"px)")),a.transformOrigin=e.origin;break;case"relax":a.transition=o(i,{transform:"cubic-bezier(0,0,.001,1)"}),a.transform="scaleY(".concat(e.scale,")"),a.transformOrigin=e.origin;break;default:a.transition=o(i,{})}return a}(this.parameters),this.parameters.spin&&(this.spinner=(c=(n=this).node,u=c.getBoundingClientRect(),f=document.createElement("div"),l=document.documentElement,f.innerHTML=(a=n.parameters.spinSize,s=n.parameters.spinColor,'<svg width="'.concat(a,'" height="').concat(a,'" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="').concat(s,'" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>')),setTimeout(function(){return i(f,{position:"absolute",top:u.top+l.scrollTop+"px",left:u.left+l.scrollLeft+"px",width:c.offsetWidth+"px",height:c.offsetHeight+"px",display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .23s ease-out"}).then(function(){return document.body.appendChild(f)})},200),f))},get:function(){return this.parameters}}]),t}(),f=new Map,l=function(e){if(f.has(e))return f.get(e);var t=new u(e);return f.set(e,t),t},d=function(e,t){if(e.continue&&t>1)return r=t-1,f.get(Array.from(f.keys())[r]);if(e.await){var n=document.querySelectorAll("#"+e.await)[0];return n?l(n):void 0}var r},m=function(){function t(){e(this,t)}return n(t,null,[{key:"initiate",value:function(){for(var e=document.querySelectorAll(".honey"),t=function(t){var n=l(e[t]),r=d(n.parameters,t);r?r.isLoaded().then(function(){setTimeout(function(){return n.animate()},n.parameters.hold)}):n.animate()},n=0;n<e.length;n++)t(n)}},{key:"generateNode",value:function(e){return new u(e)}}]),t}();window.Honeymate=m,document.addEventListener("DOMContentLoaded",m.initiate),document.write("<style>.honey{opacity:0}@keyframes honeySpin{0%{transform:rotate(-360deg)}to{transform:rotate(360deg)}}</style>")}();
