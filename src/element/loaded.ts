/**
 * Checks if image is loaded
 */
export async function imageLoaded (url: string): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onload = () => { resolve(true) }
    image.onerror = () => { resolve(false) }
    image.src = url
  })
}
