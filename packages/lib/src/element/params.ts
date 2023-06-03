import {
  AnimationDirection,
  type AnimationParams,
  type AnimationEffect,
  type Maybe,
  type AnimationOrigin,
  AnimationOriginDirection
} from '../types'

function directionFromData (data: DOMStringMap): AnimationDirection {
  if (data.left) {
    return AnimationDirection.left
  } else if (data.right) {
    return AnimationDirection.right
  } else if (data.bottom) {
    return AnimationDirection.bottom
  } else {
    return AnimationDirection.top
  }
}

const supportsExpose = 'IntersectionObserver' in window

function safeParseInt (value: Maybe<string>, fallback = 0): number {
  if (!value) {
    return fallback
  }
  return parseInt(value, 10)
}

function offsetFromData (data: DOMStringMap, fallback: number): number {
  if (data.up) {
    return safeParseInt(data.up)
  } else if (data.left) {
    return safeParseInt(data.left)
  } else if (data.right) {
    return safeParseInt(data.right)
  } else if (data.bottom) {
    return safeParseInt(data.bottom)
  } else {
    return fallback
  }
}

function isPropertyExists (data: DOMStringMap, propName: string): boolean {
  return (data as Record<string, string>).hasOwnProperty(propName)
}

/**
* Transform dataset to HoneyNode parameters
*/
export function parseDataParams (data: DOMStringMap): AnimationParams {
  return {
    // Appearance
    effect: data.effect ? data.effect as unknown as AnimationEffect : 'slide',
    direction: directionFromData(data),
    origin: data.origin ? data.origin as AnimationOrigin : AnimationOriginDirection.Center,
    scale: safeParseInt(data.scale, 87),
    offset: offsetFromData(data, 32),
    // Timings
    duration: safeParseInt(data.duration, 640),
    delay: safeParseInt(data.delay, 0),
    // Awaits
    expose: supportsExpose && isPropertyExists(data, 'expose'),
    await: data.await ?? '',
    continue: isPropertyExists(data, 'continue'),
    // Spinner
    spin: isPropertyExists(data, 'spin'),
    spinSize: safeParseInt(data.spinSize, 24)
  }
}
