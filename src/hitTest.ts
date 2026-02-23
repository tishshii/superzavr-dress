import type { ItemDef } from './types'

const ALPHA_THRESHOLD = 10

const pixelCache = new Map<string, { data: Uint8ClampedArray; width: number; height: number }>()

export function preloadItemPixels(item: ItemDef): Promise<void> {
  return new Promise((resolve) => {
    if (pixelCache.has(item.id)) { resolve(); return }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = item.width
      canvas.height = item.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, item.width, item.height)
      const imageData = ctx.getImageData(0, 0, item.width, item.height)
      pixelCache.set(item.id, { data: imageData.data, width: item.width, height: item.height })
      resolve()
    }
    img.onerror = () => resolve()
    img.src = item.src
  })
}

export function preloadAllItems(items: ItemDef[]): Promise<void> {
  return Promise.all(items.map(preloadItemPixels)).then(() => {})
}

export function isOpaqueAt(itemId: string, localX: number, localY: number): boolean {
  const cached = pixelCache.get(itemId)
  if (!cached) return true

  const x = Math.floor(localX)
  const y = Math.floor(localY)

  if (x < 0 || y < 0 || x >= cached.width || y >= cached.height) return false

  return cached.data[(y * cached.width + x) * 4 + 3] > ALPHA_THRESHOLD
}
