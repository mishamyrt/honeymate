export default function generateSpinnerBlock(block, size, color) {
    const spinner = document.createElement('div');
    spinner.style.position = 'absolute';
    spinner.style.width = block.offsetWidth + 'px';
    spinner.style.height = block.offsetHeight + 'px';
    spinner.style.transition = 'opacity .5s ease-out';
    spinner.style.opacity = 0;
    spinner.style.top = block.offsetTop + 'px';
    spinner.style.left = block.offsetLeft + 'px';
    spinner.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;margin:-' +
        size / 2 +
        ';left:50%;top:50%" width="' +
        size +
        '" height="' +
        size +
        '" viewBox="0 0 100 100"><defs><mask id="cut"><rect width="100" height="100" fill="white" /><circle r="44" cx="50" cy="50" fill="' + color + '" /><polygon points="50,50 100,25 150,50 100,75" fill="' + color + '" style="stransform-origin: 50 50; animation: a 1333ms linear infinite"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1333ms" repeatCount="indefinite"/></polygon></mask></defs><circle r="50" cx="50" cy="50" mask="url(#cut)" /></svg>';
    const parent = block.parentNode;
    const next = block.nextSibling;
    if (next) {
        parent.insertBefore(spinner, next);
    }
    else {
        parent.appendChild(spinner);
    }
    return spinner;
}
