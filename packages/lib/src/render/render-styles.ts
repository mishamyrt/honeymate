import { type AnimationRenderer } from './types'
import { createKeyframes } from './keyframes'
import { sleep } from '../utils'

function nextFrame (): Promise<number> {
  return new Promise(requestAnimationFrame)
}

function applyKeyframe (frame: Keyframe, node: HTMLElement): void {
  const props = Object.keys(frame)
  for (let i = 0; i < props.length; i++) {
    if (!props[i]) {
      continue
    }
    const prop = props[i] as string
    const value = frame[props[i] as keyof Keyframe]
    node.style[prop as any] = value ? value.toString() : ''
  }
}

function clearProps (node: HTMLElement, frames: Keyframe[]): void {
  const allProps = [
    ...Object.keys(frames[0] as Keyframe),
    ...Object.keys(frames[1] as Keyframe),
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

/**
 * Renderer that uses the element.styles[] method from the HTML DOM specification.
 */
export const renderStyles: AnimationRenderer = async (params, node) => {
  const [frames, options] = createKeyframes(params)
  applyKeyframe(frames[0] as Keyframe, node)
  await sleep(50)
  await nextFrame()
  node.style.transition = `${options.duration}ms ${options.easing}`
  await sleep(50)
  applyKeyframe(frames[1] as Keyframe, node)
  await sleep(params.duration + 50)
  clearProps(node, frames)
}
