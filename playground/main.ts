import { animate, reset } from '../src'

function expose (button?: HTMLButtonElement, node: ParentNode = document): void {
  if (button) {
    button.disabled = true
  }
  setTimeout(() => {
    animate(node)
      .then(() => {
        if (button) {
          button.disabled = false
        }
      })
  }, 100)
}

expose()

const logoButton = document.querySelector<HTMLElement>('.logo')
if (logoButton) {
  logoButton.onclick = () => {
    reset()
    setTimeout(() => {
      expose()
    }, 500)
  }
}

const modules = document.querySelectorAll<HTMLElement>('.module')
modules.forEach(m => {
  const button = m.querySelector<HTMLButtonElement>('button')
  if (!button) {
    return
  }
  const columns = m.querySelector<HTMLElement>('.columns')
  if (!columns) {
    return
  }
  button.onclick = () => {
    reset(columns)
    setTimeout(() => { expose(button, columns) }, 300)
  }
})
