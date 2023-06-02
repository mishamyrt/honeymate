import { type AnimationRenderer } from './types'
import { createKeyframes } from './keyframes'

/**
 * Renderer that uses the element.animate() method from the Web Animations API specification.
 */
export const renderWebAnimation: AnimationRenderer = async (params, node) => {
  const [frames, options] = createKeyframes(params)
  const animation = node.animate(frames, options)
  await animation.finished
}
