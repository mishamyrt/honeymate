export default function animate(block){
    setTimeout(function () {
        requestAnimationFrame(function () {
            // block.removeSpinner();
            switch (block.effect) {
                case "relax":
                    block.self.style.transition =
                        "opacity " +
                        block.duration +
                        "ms ease-out, transform " +
                        block.duration +
                        "ms cubic-bezier(0, 0, 0.001, 1)";
                    block.self.style.transform = "scaleY(1)";
                    break;
                case "zoom":
                    block.self.style.transition =
                        "opacity " +
                        block.duration +
                        "ms ease-out, transform " +
                        block.duration +
                        "ms cubic-bezier(0, 0.7, 0.3, 1)";
                    block.self.style.transform = "scale(1)";
                    break;
                case "helix":
                    block.self.style.transition =
                        "opacity " +
                        block.duration +
                        "ms ease-out, transform " +
                        block.duration +
                        "ms cubic-bezier(0, 0.75, 0.25, 1)";
                    block.self.style.transform = "scale(1) rotate(0deg)";
                    break;
                case "slide":
                    block.self.style.transition =
                        "opacity " +
                        block.duration +
                        "ms ease-out, transform " +
                        block.duration +
                        "ms cubic-bezier(0, 0.9, 0.1, 1)";
                    block.self.style.opacity = "";
                    block.self.style.transform = "translate(0)";
                    break;
                default:
                    block.self.style.transition =
                        "opacity " + block.duration + "ms ease-out";
                    break;
            }
            block.self.style.opacity = "1";
        });
        block.self.classList.remove("is__honeyHidden");
    }, block.delay);
    setTimeout(function () {
        block.self.style.transition = "";
        block.self.style.transform = "";
        block.self.style.transformOrigin = "";
    }, block.duration + block.delay + 30);
}

export const prepareAnimation = (block) => {
    switch (block.effect) {
        case "relax":
            block.self.style.transform = "scaleY(" + block.scale + ")";
            if (block.origin)
                block.self.style.transformOrigin = "center " + block.origin + " 0px";
            else block.self.style.transformOrigin = "center bottom 0px";
            break;
        case "slide":
            switch (block.direction) {
                case 2:
                    block.self.style.transform = "translateY(-" + block.offset + "px)";
                    break;
                case 3:
                    block.self.style.transform = "translateX(" + block.offset + "px)";
                    break;
                case 4:
                    block.self.style.transform = "translateX(-" + block.offset + "px)";
                    break;
                case 1:
                default:
                    block.self.style.transform = "translateY(" + block.offset + "px)";
                    break;
            }
            break;
        case "zoom":
            block.self.style.transform = "scale(" + block.scale + ")";
            break;
        case "helix":
            block.self.style.transform = "scale(" + block.scale + ") rotate(90deg)";
            break;
    }
}