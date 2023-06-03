import { HoneyElement } from './element/element'
import { type Maybe } from './types'

export class HoneyRegistry {
  private _elements: HoneyElement[] = []
  private _nodes: HTMLElement[] = []

  public get elements (): HoneyElement[] {
    return this._elements
  }

  public has (node: HTMLElement): boolean {
    return this._nodes.includes(node)
  }

  public clear (): void {
    this._elements = []
    this._nodes = []
  }

  /**
   * Returns a HoneyElement from an HTMLElement.
   * If the node is not in the registry, it will create and return an entry
   */
  public getElement (node: HTMLElement): HoneyElement {
    const index = this._nodes.indexOf(node)
    if (index >= 0) {
      return this._elements[index] as HoneyElement
    }
    return this.add(node)
  }

  public getAwaited (el: HoneyElement): Maybe<HoneyElement> {
    if (el.params.continue) {
      if (this._elements.length > 0) {
        return this.getByIndex(this._elements.length - 2)
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
    return this._nodes.length
  }

  public getByIndex (i: number): Maybe<HoneyElement> {
    if (i < 0 || i > this._elements.length) {
      return
    }
    return this._elements[i]
  }

  public add (node: HTMLElement): HoneyElement {
    if (this._nodes.includes(node)) {
      throw new Error('Element already exists')
    }
    const element = new HoneyElement(node)
    this._nodes.push(node)
    this._elements.push(element)
    return element
  }
}
