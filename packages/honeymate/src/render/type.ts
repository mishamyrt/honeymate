export type Frame = Partial<CSSStyleDeclaration>

export interface AnimationDescription {
  frames: Frame[]
  easing: string
}
