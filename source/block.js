export default class HoneyBlock {
    constructor(item, previous) {
        let parameters = item.dataset;
        this.self = item;
        this.duration = parameters.duration ? parameters.duration : 640;
        this.effect = parameters.effect ? parameters.effect : "fade";
        this.expose = parameters.expose ? parameters.expose == 'true' : false;
        this.delay = parameters.delay ? parameters.delay : 0;
        this.hold = parameters.hold ? parameters.hold : 0;
        // this.expose = parameters.expose ? parameters.expose : false;
        this.scale = parameters.scale ? parameters.scale : 0.87;
        this.origin = parameters.origin ? parameters.origin : "bottom";
        this.offset =
            parameters.up || parameters.down || parameters.left || parameters.right
                ? parameters.up ||
                parameters.down ||
                parameters.left ||
                parameters.right
                : 32;
        if (parameters.up) this.direction = 1;
        else if (parameters.left) this.direction = 3;
        else if (parameters.right) this.direction = 4;
        else this.direction = 2;
        if (parameters.spinner) {
            let size = parameters.spinSize ? parameters.spinSize : 36;
            let color = parameters.spinColor ? parameters.spinColor : "#000";
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
            this.spinner = spinner;
            let parent = this.self.parentNode;
            let next = this.self.nextSibling;
            if (next) {
                parent.insertBefore(item.spinner, next);
            } else {
                parent.appendChild(item.spinner);
            }
            setInterval(function () {
                requestAnimationFrame(function(){
                    item.spinner.style.opacity = 1;
                })
            }, 120);
        } else {
            this.spinner = null
        }
        if (parameters.await || parameters.continue) {
            if (parameters.await) {
                let requested = document.getElementById(parameters.await);
                if (requested != undefined) this.waited = requested;
                else this.waited = null;
            } else {
                this.waited = previous;
            }
        } else {
            this.waited = null;
        }
        
    }
    removeSpinner() {
        this.spinner.style.top = '-9999px';
        setTimeout(function () {
            this.spinner.remove();
        }, 2000)
    }
}