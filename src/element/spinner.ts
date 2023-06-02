import { type HoneyElement } from '.'

/**
 * Generates spinner SVG string
 */
export function getSpinner (size: number): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="animation: honeySpin 1.7s linear infinite"><circle cx="50" cy="50" fill="none" stroke="var(--honey-spinner)" stroke-width="10" r="35" stroke-dasharray="90 60"></circle></svg>`
}

/**
 * Applies CSS styles to the node
 */
export function applyStyle (
  node: HTMLElement,
  style: Partial<Record<keyof CSSStyleDeclaration, string>>
): void {
  const keys = Object.keys(style)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof CSSStyleDeclaration
    (node.style as any)[key] = style[key]
  }
}

/**
 * Generates spinner node in DOM
 */
export function generateSpinner (element: HoneyElement): HTMLDivElement {
  const spinNode = document.createElement('div')
  spinNode.className = 'honey-spin'
  spinNode.innerHTML = getSpinner(
    element.params.spinSize
  )
  setTimeout(() => {
    const doc = document.documentElement
    const rect = element.node.getBoundingClientRect()
    applyStyle(spinNode, {
      position: 'absolute',
      top: `${rect.top + doc.scrollTop}px`,
      left: `${rect.left + doc.scrollLeft}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity .23s ease-out'
    })
    document.body.appendChild(spinNode)
  }, 100)
  return spinNode
}

/**
 * Hides and removes spinner from DOM
 */
export function removeSpinner (node: HTMLDivElement): void {
  requestAnimationFrame(() => {
    node.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(node)
    }, 500)
  })
}
