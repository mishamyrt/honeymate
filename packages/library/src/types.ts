export type Maybe<T> = T | undefined

export type ParamsBuilder = (initial: AnimationParams) => AnimationParams

export enum AnimationDirection {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left'
}

export enum AnimationOriginDirection {
  Center = 'center'
}

export type AnimationOrigin = AnimationDirection | AnimationOriginDirection

export type AnimationEffect = 'zoom' | 'fade' | 'slide' | 'relax'

export interface AnimationParams {
  direction: AnimationDirection
  duration: number
  effect: AnimationEffect
  expose: boolean
  delay: number
  scale: number
  await: string
  origin: AnimationOrigin
  offset: number
  spin: boolean
  spinSize: number
  continue: boolean
}
