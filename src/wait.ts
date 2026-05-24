/**
 * Finds background image on node
 */
function getBackgroundImage(node: Element): string | null {
  const style = getComputedStyle(node);
  const background = style.background || style.backgroundImage;
  if (!background) {
    return null;
  }
  const match = style.background.match(/url\(\s*(['"]?)(.*)\1\s*\)/);
  return match ? match[2] : null;
}

/**
 * Returns URL of image element or background image of node,
 * or null if neither is available
 */
function getImageUrl(node: Element) {
  if (isImageElement(node)) {
    return node.src;
  }
  return getBackgroundImage(node);
}

/**
 * Asserts that node is an image element
 */
function isImageElement(node: Element): node is HTMLImageElement {
  return node.tagName === "IMG";
}

/**
 * Waits for image to load.
 * Resolves when loaded, never rejects
 */
function waitImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = url;
  });
}

/**
 * Resolves when all images in node (including descendants) are loaded
 */
export function waitImages(node: Element) {
  const nodes = [node, ...node.querySelectorAll("*")];
  const images = nodes.map(getImageUrl).filter(Boolean) as string[];
  return Promise.all(images.map(waitImage));
}
