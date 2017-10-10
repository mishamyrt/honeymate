import generateSpinnerBlock from './spinner.js';

export default class HoneyBlock {
    constructor(item, previous) {
        const parameters = item.dataset;
        const getDirection = () => {
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
        };
        const getWaited = (prev) => {
            if (parameters.await || parameters.continue) {
                if (parameters.await) {
                    const requested = document.getElementById(parameters.await);
                    if (requested) {
                        return requested;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return prev;
                }
            }
            else {
                return null;
            }
        };
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
        this.waited = getWaited(previous);
        if (parameters.spinner) {
            parameters.spinner = generateSpinnerBlock(item,
                parameters.spinSize ? parameters.spinSize : 36,
                parameters.spinColor ? parameters.spinColor : '#000');
        }
        else {
            this.spinner = null;
        }
    }
    removeSpinner() {
        this.spinner.style.top = '-9999px';
        setTimeout(function () {
            this.spinner.remove();
        }, 2000);
    }
}
