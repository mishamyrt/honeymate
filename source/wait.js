export default function waitImages(item, callback) {
    const innerItems = item.querySelectorAll('*');
    const imgs = [];
    let computedStyle = getComputedStyle(item);
    if (computedStyle.background !== '' || computedStyle.backgroundImage !== '') {
        const uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
        if (uri) {
            imgs.push(uri[2]);
        }
    }
    let loadedCount = 0;
    innerItems.forEach(function (item) {
        computedStyle = getComputedStyle(item);
        if (item.tagName === 'IMG') {
            imgs.push(item.getAttribute('src'));
        }
        else {
            const uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
            if (uri) {
                imgs.push(uri[2]);
            }
        }
    });
    if (imgs.length === 0) {
        callback();
    }
    else {
        imgs.forEach(function (img) {
            const image = new Image();
            image.onload = function () {
                loadedCount++;
                if (imgs.length === loadedCount) {
                    callback();
                }
            };
            image.onerror = image.onload;
            image.src = img;
        });
    }
}
