import { generateSpinner, removeSpinner } from './spinner'
import type { AnimationParams, Maybe } from '../types'
import { collectImages } from './collect'
import { createAnimation } from '../animation'
import { imageLoaded, sleep } from '../utils'
import { parseDataParams } from './params'
import { CLASS_VISIBLE } from '../constants'

enum ElementState {
  Hidden,
  Exposing,
  Exposed
}

export class HoneyElement {
  public params: AnimationParams
  private readonly images: string[] = []
  private awaitedElement: Maybe<HoneyElement>
  private spinner: Maybe<HTMLDivElement>
  private state: ElementState = ElementState.Hidden

  constructor (public readonly node: HTMLElement) {
    this.params = parseDataParams(node.dataset)
    this.images = collectImages(node)
  }

  public setAwaited (el: HoneyElement): void {
    this.awaitedElement = el
  }

  public get visible (): boolean {
    return this.state !== ElementState.Hidden
  }

  public async ready (): Promise<void> {
    if (this.awaitedElement) {
      await this.awaitedElement.whenVisible()
    }
    await this.imagesLoaded()
    if (this.params.delay > 0) {
      await sleep(this.params.delay)
    }
  }

  public async whenVisible (): Promise<void> {
    while (!this.visible) {
      await sleep(10)
    }
  }

  public async imagesLoaded (): Promise<boolean> {
    const requests = this.images.map(imageLoaded)
    const loaded = await Promise.all(requests)
    return !loaded.some(v => !v)
  }

  public hide (): void {
    this.node.classList.remove(CLASS_VISIBLE)
    this.state = ElementState.Hidden
  }

  public showSpinner (): void {
    this.spinner = generateSpinner(this)
  }

  public async show (): Promise<void> {
    if (this.visible) {
      return
    }
    this.state = ElementState.Exposing
    if (this.spinner) {
      removeSpinner(this.spinner)
    }
    const [frames, options] = createAnimation(this.params)
    const animation = this.node.animate(frames, options)
    await animation.finished
    this.node.classList.add(CLASS_VISIBLE)
    this.state = ElementState.Exposed
  }
}
