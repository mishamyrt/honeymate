import { animate } from '../../../library/src'

animate()
// function expose (button?: HTMLButtonElement, node: ParentNode = document): void {
//   if (button != null) {
//     button.disabled = true
//   }
//   setTimeout(() => {
//     animate(node).then(() => {
//       if (button != null) {
//         button.disabled = false
//       }
//     })
//   }, 100)
// }

// expose()

// function reloadAll (): void {
//   reset()
//   setTimeout(() => {
//     expose()
//   }, 500)
// }

// const logoButton = document.querySelector<HTMLElement>('.logo')
// if (logoButton != null) {
//   logoButton.onclick = reloadAll
// }

// window.addEventListener('keydown', (e: KeyboardEvent) => {
//   if (e.key === 'r' && e.ctrlKey) {
//     e.preventDefault()
//     reloadAll()
//   }
// })

// const modules = document.querySelectorAll<HTMLElement>('.module')
// modules.forEach((m) => {
//   const button = m.querySelector<HTMLButtonElement>('button')
//   if (button == null) {
//     return
//   }
//   const columns = m.querySelector<HTMLElement>('.columns')
//   if (columns == null) {
//     return
//   }
//   button.onclick = () => {
//     reset(columns)
//     setTimeout(() => {
//       expose(button, columns)
//     }, 300)
//   }
// })
