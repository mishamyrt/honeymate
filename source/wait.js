export default function waitImages(item, fn) {
    let innerItems = item.querySelectorAll("*");
    let imgs = [];
    let computedStyle = getComputedStyle(item);
    if (computedStyle.background != "" || computedStyle.backgroundImage != "") {
        let uri = computedStyle.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
        if (uri) imgs.push(uri[2]);
    }
    let loadedCount = 0;
    innerItems.forEach(function (item, i) {
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
        imgs.forEach(function (img, i) {
            let image = new Image();
            image.onload = function () {
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