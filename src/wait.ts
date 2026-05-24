/**
 * Finds background image on node
 */
export function getBackgroundImage(node: Element): string | null {
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
export function getMediaLoaded(node: Element) {
  if (isImageElement(node)) {
    return node.src;
  }
  return getBackgroundImage(node);
}

/**
 * Asserts that node is an image element
 */
export function isImageElement(node: Element): node is HTMLImageElement {
  return node.tagName === "IMG";
}

export function isVideoElement(node: Element): node is HTMLVideoElement {
  return node.tagName === "VIDEO";
}

/**
 * Waits for image to load.
 * Resolves when loaded, never rejects
 */
export function waitImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = url;
  });
}

export function waitVideo(node: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    node.addEventListener("canplaythrough", () => resolve());
  });
}

/**
 * Resolves when all images in node (including descendants) are loaded
 */
export function waitMedia(parent: Element) {
  const elements = [parent, ...parent.querySelectorAll("*")];
  const mediaPromises = [];
  for (const element of elements) {
    if (isImageElement(element)) {
      mediaPromises.push(waitImage(element.src));
    } else if (isVideoElement(element)) {
      mediaPromises.push(waitVideo(element));
    } else {
      const bgImage = getBackgroundImage(element);
      if (bgImage) {
        mediaPromises.push(waitImage(bgImage));
      }
    }
  }
  return Promise.all(mediaPromises);
}
