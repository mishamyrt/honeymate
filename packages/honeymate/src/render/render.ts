import { type AnimationParams } from '../types'
import { sleep } from '../utils'
import { describeAnimation } from './describe'
import { type Frame } from './type'

function nextFrame (): Promise<number> {
  return new Promise(requestAnimationFrame)
}

function applyFrame (frame: Frame, node: HTMLElement): void {
  const props = Object.keys(frame)
  for (let i = 0; i < props.length; i++) {
    if (!props[i]) {
      continue
    }
    const prop = props[i] as string
    const value = frame[props[i] as keyof Frame]
    node.style[prop as any] = value ? value.toString() : ''
  }
}

function clearProps (node: HTMLElement, frames: Frame[]): void {
  const allProps = [
    ...Object.keys(frames[0] as Frame),
    ...Object.keys(frames[1] as Frame),
    'transition'
  ]
  const unique = Array.from(
    new Set<string>(allProps)
  )
  for (let i = 0; i < unique.length; i++) {
    const key = unique[i] as any
    node.style[key] = ''
  }
}

export async function renderAnimation (params: AnimationParams, node: HTMLElement): Promise<void> {
  const { frames, easing } = describeAnimation(params)
  applyFrame(frames[0] as Frame, node)
  await sleep(50)
  await nextFrame()
  node.style.transition = `${params.duration}ms ${easing}`
  requestAnimationFrame(() => {
    applyFrame(frames[1] as Frame, node)
  })
  await sleep(params.duration + 50)
  clearProps(node, frames)
}
