import { CLASS_MAIN, CLASS_VISIBLE } from '../constants'

export function selectHoneyNodes (target: ParentNode): HTMLElement[] {
  return Array.from(
    target.querySelectorAll(`.${CLASS_MAIN}:not(.${CLASS_VISIBLE})`)
  )
}
