import { HoneyElement } from './element/element'
import { type Maybe } from './types'

export class HoneyRegistry {
  private readonly storage = new Map<HTMLElement, HoneyElement>()

  public has (node: HTMLElement): boolean {
    return this.storage.has(node)
  }

  public clear (): void {
    this.storage.clear()
  }

  /**
   * Returns a HoneyElement from an HTMLElement.
   * If the node is not in the registry, it will create and return an entry
   */
  public getElement (node: HTMLElement): HoneyElement {
    if (this.storage.has(node)) {
      return this.storage.get(node) as HoneyElement
    }
    const element = new HoneyElement(node)
    this.storage.set(node, element)
    return element
  }

  public getAwaited (el: HoneyElement): Maybe<HoneyElement> {
    if (el.params.continue) {
      if (this.storage.size > 0) {
        return this.getByIndex(this.storage.size - 2)
      } else {
        return undefined
      }
    } else if (el.params.await) {
      const node = document.getElementById(el.params.await)
      return node ? this.getElement(node) : undefined
    }
    return undefined
  }

  public get size (): number {
    return this.storage.size
  }

  public getByIndex (i: number): Maybe<HoneyElement> {
    const node = Array.from(this.storage.keys())[i] as HTMLElement
    return this.storage.get(node)
  }

  public add (node: HTMLElement): HoneyElement {
    if (this.storage.has(node)) {
      throw new Error('Element already exists')
    }
    const element = new HoneyElement(node)
    this.storage.set(node, element)
    return element
  }
}
