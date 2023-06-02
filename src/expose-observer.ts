import { type HoneyElement } from './element'
import { type HoneyRegistry } from './registry'

export class ExposeObserver {
  private readonly observer: IntersectionObserver

  constructor (
    registry: HoneyRegistry,
    private readonly rootMargin = '-2%'
  ) {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const element = registry.getElement(entry.target as HTMLElement)
        if (entry.isIntersecting && !element.visible) {
          element.show()
            .then(() => {})
        }
      })
    }

    this.observer = new IntersectionObserver(callback, {
      rootMargin: this.rootMargin,
      threshold: 0.05
    })
  }

  public clear (): void {
    this.observer.disconnect()
  }

  public add (element: HoneyElement): void {
    this.observer.observe(element.node)
  }
}
