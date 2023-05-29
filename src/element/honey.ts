import { generateSpinner, removeSpinner } from '../spinner'
import { sleep } from '../timing'
import { type Maybe } from '../types'
import { collectImages } from './collect'
import { createAnimation } from './keyframes'
import { imageLoaded } from './loaded'
import { parseDataParams } from './params'
import { type AnimationParams } from './types'

export class HoneyElement {
  public readonly params: AnimationParams
  private readonly images: string[] = []
  private awaitedElement: Maybe<HoneyElement>
  private spinner: Maybe<HTMLDivElement>

  constructor (public readonly node: HTMLElement) {
    this.params = parseDataParams(node.dataset)
    this.images = collectImages(node)
  }

  public setAwaited (el: HoneyElement): void {
    this.awaitedElement = el
  }

  public async ready (): Promise<void> {
    if (this.awaitedElement) {
      await this.awaitedElement.ready()
    }
    const requests = this.images.map(imageLoaded)
    await Promise.all(requests)
  }

  public async visible (): Promise<void> {
    await this.ready()
    if (this.params.hold) {
      await sleep(this.params.hold)
    }
  }

  public hide (): void {
    this.node.classList.remove('__visible')
  }

  public showSpinner (): void {
    this.spinner = generateSpinner(this)
  }

  public async show (): Promise<void> {
    if (this.spinner) {
      removeSpinner(this.spinner)
    }
    if (this.params.delay) {
      await sleep(this.params.delay)
    }
    await new Promise<void>((resolve) => {
      const [frames, options] = createAnimation(this.params)
      const animation = this.node.animate(frames, options)
      animation.onfinish = () => {
        this.node.classList.add('__visible')
        resolve()
      }
    })
  }
}
