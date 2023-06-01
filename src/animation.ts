import { AnimationDirection, type AnimationParams } from './types'

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

export function createAnimation (params: AnimationParams): [Keyframe[], KeyframeAnimationOptions] {
  let easing
  const frameFrom: Partial<CSSStyleDeclaration> = {
    opacity: '0'
  }
  const frameTo: Partial<CSSStyleDeclaration> = {
    opacity: '1',
    transform: 'scale(1) scaleY(1) scaleX(1) rotate(0deg)'
  }
  switch (params.effect) {
    case 'zoom':
      frameFrom.transform = `scale(${params.scale})`
      easing = 'cubic-bezier(0,.7,.3,1)'
      break
    case 'helix':
      frameFrom.transform = `scale(${params.scale}) rotate(90deg)`
      easing = 'cubic-bezier(0,.75,.25,1)'
      break
    case 'relax':
      frameFrom.transform = `scaleY(${params.scale})`
      frameFrom.transformOrigin = params.origin
      frameTo.transformOrigin = params.origin
      easing = 'cubic-bezier(0,0,0,1)'
      break
    default:
      frameFrom.transform = formatTranslate(params.direction, params.offset)
      frameFrom.transformOrigin = params.origin
      frameTo.transformOrigin = params.origin
      easing = 'cubic-bezier(0,.9,.1,1)'
      break
  }
  return [[frameFrom as Keyframe, frameTo as Keyframe], {
    easing,
    duration: params.duration,
    iterations: 1
  }]
}
