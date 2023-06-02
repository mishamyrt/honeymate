import { type AnimationParams } from '../types'

export type AnimationRenderer = (params: AnimationParams, node: HTMLElement) => Promise<void>
