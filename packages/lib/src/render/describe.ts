import { AnimationDirection, type AnimationParams } from '../types'
import { type AnimationDescription, type Frame } from './type'

/**
 * Generates CSS transform string for slide transition
 */
function formatTranslate (direction: AnimationDirection, offset: number): string {
  let transformString =
    direction === AnimationDirection.top ||
    direction === AnimationDirection.bottom
      ? 'Y'
      : 'X'
  transformString += direction === AnimationDirection.left || direction === AnimationDirection.top ? '(-' : '('
  return `translate${transformString}${offset}px)`
}

export function describeAnimation (params: AnimationParams): AnimationDescription {
  let easing
  let transform
  switch (params.effect) {
    case 'zoom':
      transform = `scale(${params.scale / 100})`
      easing = 'cubic-bezier(0,.7,.3,1)'
      break
    case 'fade':
      easing = 'ease-in-out'
      break
    case 'relax':
      transform = `scaleY(${params.scale / 100})`
      easing = 'cubic-bezier(0,0,0,1)'
      break
    default:
      transform = formatTranslate(params.direction, params.offset)
      easing = 'cubic-bezier(0,.9,.1,1)'
      break
  }
  const frameFrom: Frame = {
    opacity: '0',
    transformOrigin: params.origin,
    transform
  }
  return {
    frames: [frameFrom, { opacity: '1', transform: '' }],
    easing
  }
}
