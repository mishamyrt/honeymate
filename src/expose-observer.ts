import { type HoneyElement } from './element'
import { type HoneyRegistry } from './registry'

export class ExposeObserver {
  private readonly observer: IntersectionObserver

  constructor (registry: HoneyRegistry) {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const element = registry.getElement(entry.target as HTMLElement)
        if (entry.isIntersecting) {
          element.show()
            .then(() => {})
            .catch(console.error)
        } else {
          element.hide()
        }
      })
    }

    this.observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.05
    })
  }

  public add (element: HoneyElement): void {
    this.observer.observe(element.node)
  }
}
