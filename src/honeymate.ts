import { CLASS_MAIN, CLASS_VISIBLE } from './constants'
import { ExposeObserver } from './expose-observer'
import { HoneyRegistry } from './registry'
import { type ParamsBuilder } from './types'

const registry = new HoneyRegistry()
const observer = new ExposeObserver(registry)

export function animate (target: ParentNode = document, prepareParams?: ParamsBuilder): Promise<unknown> {
  const nodes = Array.from(
    target.querySelectorAll(`.${CLASS_MAIN}:not(.${CLASS_VISIBLE})`)
  )
  const observer = new ExposeObserver(registry)
  const animations = nodes.map(node => {
    const element = registry.getElement(node as HTMLElement)
    if (prepareParams) {
      element.params = prepareParams(element.params)
    }
    if (element.params.spin) {
      element.showSpinner()
    }
    const previous = registry.getAwaited(element)
    if (previous) {
      element.setAwaited(previous)
    }
    if (element.params.expose) {
      return element
        .ready()
        .then(() => observer.add(element))
    }
    return element
      .ready()
      .then(() => element.show())
  })
  return Promise.all(animations)
}

export function reset (target: ParentNode = document): void {
  const nodes = target.querySelectorAll(`.${CLASS_MAIN}.${CLASS_VISIBLE}`)

  nodes.forEach((node) => {
    node.classList.remove(CLASS_VISIBLE)
  })
  const spins = document.querySelectorAll<HTMLDivElement>('.honey-spin')
  spins.forEach(spin => document.body.removeChild(spin))
  registry.clear()
  observer.clear()
}
