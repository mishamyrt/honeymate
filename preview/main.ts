import { animate, reset } from '../src'

function expose (module: ParentNode = document): void {
  animate(document, params => ({
    ...params,
    effect: 'zoom'
  }))
}

expose()

const button = document.querySelectorAll('button')
button.forEach((b) => {
  const node = b.parentElement as HTMLElement
  b.onclick = () => {
    reset(node)
    expose(node)
  }
})
