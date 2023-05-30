import { type Maybe } from '../types'
import { AnimationDirection, type AnimationParams, type AnimationEffect } from './types'

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

function safeParseFloat (value: Maybe<string>, fallback = 0): number {
  if (!value) {
    return fallback
  }
  return parseFloat(value)
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

/**
* Transform dataset to HoneyNode parameters
*/
export function parseDataParams (data: DOMStringMap): AnimationParams {
  return {
    direction: directionFromData(data),
    duration: safeParseInt(data.duration, 640),
    effect: data.effect ? data.effect as unknown as AnimationEffect : 'slide',
    expose: supportsExpose && (data as Record<string, string>).hasOwnProperty('expose'),
    delay: safeParseInt(data.delay, 0),
    hold: safeParseInt(data.hold, 0),
    scale: safeParseFloat(data.scale, 0.87),
    await: data.await ?? '',
    origin: data.origin ? data.origin as AnimationDirection : AnimationDirection.top,
    offset: offsetFromData(data, 32),
    spin: (data as Record<string, string>).hasOwnProperty('spin'),
    spinColor: data['spin-color'] ?? '#000',
    spinSize: safeParseInt(data['spin-size'], 24),
    continue: (data as Record<string, string>).hasOwnProperty('continue')
  }
}
