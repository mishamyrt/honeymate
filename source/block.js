export default class HoneyBlock {
    constructor(item, previous) {
        const parameters = item.dataset;
        this.self = item;
        this.duration = parameters.duration ? parameters.duration : 640;
        this.effect = parameters.effect ? parameters.effect : 'fade';
        this.expose = parameters.expose ? parameters.expose === 'true' : false;
        this.delay = parameters.delay ? parameters.delay : 0;
        this.hold = parameters.hold ? parameters.hold : 0;
        this.scale = parameters.scale ? parameters.scale : 0.87;
        this.origin = parameters.origin ? parameters.origin : 'bottom';
        this.offset =
            parameters.up || parameters.down || parameters.left || parameters.right
                ? parameters.up ||
                parameters.down ||
                parameters.left ||
                parameters.right
                : 32;
        this.direction = getDirection();
        this.waited = getWaited();
        if (parameters.spinner) {
            addSpinner(parameters.spinSize ? parameters.spinSize : 36,
                parameters.spinColor ? parameters.spinColor : '#000');
        }
        else {
            this.spinner = null;
        }

        function getWaited() {
            if (parameters.await || parameters.continue) {
                if (parameters.await) {
                    const requested = document.getElementById(parameters.await);
                    if (requested) {
                        this.waited = requested;
                    }
                    else {
                        this.waited = null;
                    }
                }
                else {
                    this.waited = previous;
                }
            }
            else {
                this.waited = null;
            }
        }
        function getDirection() {
            if (parameters.up) {
                return 1;
            }
            else if (parameters.left) {
                return 3;
            }
            else if (parameters.right) {
                return 4;
            }
            else {
                return 2;
            }
        }
        function addSpinner(size, color) {
            const spinner = document.createElement('div');
            spinner.style.position = 'absolute';
            spinner.style.width = this.self.offsetWidth + 'px';
            spinner.style.height = this.self.offsetHeight + 'px';
            spinner.style.transition = 'opacity .5s ease-out';
            spinner.style.opacity = 0;
            spinner.style.top = this.self.offsetTop + 'px';
            spinner.style.left = this.self.offsetLeft + 'px';
            spinner.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;margin:-' +
                size / 2 +
                ';left:50%;top:50%" width="' +
                size +
                '" height="' +
                size +
                '" viewBox="0 0 100 100"><defs><mask id="cut"><rect width="100" height="100" fill="white" /><circle r="44" cx="50" cy="50" fill="' + color + '" /><polygon points="50,50 100,25 150,50 100,75" fill="' + color + '" style="stransform-origin: 50 50; animation: a 1333ms linear infinite"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1333ms" repeatCount="indefinite"/></polygon></mask></defs><circle r="50" cx="50" cy="50" mask="url(#cut)" /></svg>';
            this.spinner = spinner;
            const parent = this.self.parentNode;
            const next = this.self.nextSibling;
            if (next) {
                parent.insertBefore(this.spinner, next);
            }
            else {
                parent.appendChild(this.spinner);
            }
            setInterval(function () {
                requestAnimationFrame(function () {
                    this.spinner.style.opacity = 1;
                });
            }, 120);
        }
    }
    removeSpinner() {
        this.spinner.style.top = '-9999px';
        setTimeout(function () {
            this.spinner.remove();
        }, 2000);
    }
}
