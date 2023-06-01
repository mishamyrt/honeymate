import { ExposeObserver } from './expose-observer'
import { HoneyRegistry } from './registry'

const registry = new HoneyRegistry()

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
    const previous = registry.getAwaited(element)
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
