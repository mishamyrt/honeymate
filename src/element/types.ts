export enum AnimationDirection {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left'
}

export type AnimationEffect = 'zoom' | 'helix' | 'slide' | 'relax'

export interface AnimationParams {
  direction: AnimationDirection
  duration: number
  effect: AnimationEffect
  expose: boolean
  delay: number
  hold: number
  scale: number
  await: string
  origin: AnimationDirection
  offset: number
  spin: boolean
  spinColor: string
  spinSize: number
  continue: boolean
}

export type FrameDescription = Partial<Record<keyof CSSStyleDeclaration, string>>
