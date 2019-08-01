import { Loader, Texture, ImageLoader, Math } from 'three'

export default class TextureUtils {
  public static load(url: string): any {
    let texture: any
    const loader = Loader.Handlers.get(url)

    if (loader !== null) {

      texture = loader.load(url)

    } else {

      texture = new Texture()
      const loaderImg = new ImageLoader()
      loaderImg.setCrossOrigin('anonymous')

      loaderImg.load(url, function (image: any) {

        texture.image = TextureUtils.ensurePowerOfTw(image)
        texture.needsUpdate = true

      })
    }

    texture.sourceFile = url

    return texture
  }

  private static ensurePowerOfTw(image: any): any {
    if (!Math.isPowerOfTwo(image.width) || !Math.isPowerOfTwo(image.height)) {

      const canvas = document.createElement('canvas')
      canvas.width = this.nextHighestPowerOfTwo_(image.width)
      canvas.height = this.nextHighestPowerOfTwo_(image.height)

      const ctx: any = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
      return canvas

    }

    return image
  }

  private static nextHighestPowerOfTwo_(x: any) {

    --x

    for (let i = 1; i < 32; i <<= 1) {

      x = x >> i

    }

    return x + 1
  }
}
