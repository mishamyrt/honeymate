import { type HoneyElement } from '../element'
import { type ParamsBuilder } from '../types'

export interface AnimateParams {
  target: ParentNode
  prepareParams?: ParamsBuilder
  children: boolean
}

export interface AnimationResults {
  elements: HoneyElement[]
  clear: () => void
}
