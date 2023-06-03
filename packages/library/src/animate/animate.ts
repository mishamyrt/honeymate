
import { ExposeObserver } from '../expose-observer'
import { HoneyRegistry } from '../registry'
import { mergeParams } from './params'
import { selectHoneyNodes } from './selector'
import { type AnimationResults, type AnimateParams } from './types'

function registerNodes ({
  target,
  children,
  prepareParams
}: AnimateParams): HoneyRegistry {
  const registry = new HoneyRegistry()
  const nodes: HTMLElement[] = []
  if (target !== document) {
    nodes.push(target as HTMLElement)
  }
  if (!children && target === document) {
    throw new Error('Disabled children while target is document')
  } else {
    nodes.push(...selectHoneyNodes(target))
  }
  nodes.forEach(node => {
    const element = registry.getElement(node)
    if (prepareParams) {
      element.params = prepareParams(element.params)
    }
    const previous = registry.getAwaited(element)
    if (previous) {
      element.setAwaited(previous)
    }
  })
  return registry
}

export async function animate (userParams?: Partial<AnimateParams>): Promise<AnimationResults> {
  const params = mergeParams(userParams)
  const registry = registerNodes(params)
  const observer = new ExposeObserver(registry)
  await Promise.all(
    registry.elements.map(async el => {
      if (el.params.spin) {
        el.showSpinner()
      }
      await el.ready()
      if (el.params.expose) {
        observer.add(el)
      } else {
        await el.show()
      }
    })
  )
  return {
    elements: registry.elements,
    clear: () => {
      registry.elements.forEach(e => e.hide())
      registry.clear()
      observer.clear()
    }
  }
}
