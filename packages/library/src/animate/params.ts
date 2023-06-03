import { type AnimateParams } from './types'

const defaultParams: AnimateParams = {
  target: document,
  children: true
}

export function mergeParams (userParams?: Partial<AnimateParams>): AnimateParams {
  if (userParams) {
    return {
      ...defaultParams,
      ...userParams
    }
  }
  return defaultParams
}
