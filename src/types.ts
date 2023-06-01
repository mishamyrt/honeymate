export type Maybe<T> = T | undefined

export type ParamsBuilder = (initial: AnimationParams) => AnimationParams

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
  scale: number
  await: string
  origin: AnimationDirection
  offset: number
  spin: boolean
  spinSize: number
  continue: boolean
}
