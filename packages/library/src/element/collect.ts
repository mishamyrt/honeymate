import { type Maybe } from '../types'

const CSS_URL_RE = /url\(\s*(['"]?)(.*)\1\s*\)/

/**
 * Attempts to retrieve a URL from a CSS property value.
 * If no URL is found, returns `undefined`
 */
function getUrl (value: Maybe<string>): Maybe<string> {
  if (!value || value === '') {
    return
  }
  const url = value.match(CSS_URL_RE)
  if (url !== null) {
    return url[2]
  }
  return undefined
}

/**
 * Attempts to retrieve a background image from a HTML node.
 * If no image is found, returns `undefined`
 */
function getBackgroundImage (node: HTMLElement): Maybe<string> {
  const style = getComputedStyle(node)
  const props = [
    style.background,
    style.backgroundImage
  ]
  for (let i = 0; i < props.length; i++) {
    const url = getUrl(props[i])
    if (url) {
      return url
    }
  }
  return undefined
}

export function collectImages (target: HTMLElement): string[] {
  const images = []
  const nodes: HTMLElement[] = Array.from(target.querySelectorAll('*'))
  nodes.push(target)
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]?.tagName === 'IMG') {
      images.push((nodes[i] as HTMLImageElement).src)
    } else {
      const url = getBackgroundImage(nodes[i] as HTMLElement)
      if (url) {
        images.push(url)
      }
    }
  }
  return images
}
