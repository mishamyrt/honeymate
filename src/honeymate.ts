import { type HoneyElement } from './element'
import { ExposeObserver } from './expose-observer'
import { HoneyRegistry } from './registry'
import { type Maybe } from './types'

const registry = new HoneyRegistry()

function findAwaited (el: HoneyElement, index: number): Maybe<HoneyElement> {
  if (el.params.continue && index > 0) {
    return registry.getByIndex(index - 1)
  } else if (el.params.await) {
    const node = document.getElementById(el.params.await)
    return node ? registry.getElement(node) : undefined
  }
  return undefined
}

export function animate (): void {
  const nodes = document.querySelectorAll('.honey:not(.__visible)')
  const observer = new ExposeObserver(registry)
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) {
      continue
    }
    const element = registry.getElement(nodes[i] as HTMLElement)
    if (element.params.spin) {
      element.showSpinner()
    }
    const previous = findAwaited(element, i)
    if (previous) {
      element.setAwaited(previous)
    }
    if (element.params.expose) {
      element
        .ready()
        .then(() => { observer.add(element) })
    } else {
      element
        .ready()
        .then(async () => { await element.show() })
    }
  }
}

export function reset (target = document): void {
  const nodes = target.querySelectorAll('.honey.__visible')

  nodes.forEach((node) => {
    node.classList.remove('__visible')
  })
  registry.clear()
}
