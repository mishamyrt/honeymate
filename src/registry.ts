import { HoneyElement } from './element/honey'
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

// export const Registry = new HoneyRegistry()
