import { useEffect } from 'react'
import { ITEM_CATALOG } from './config'
import { preloadAllItems, isOpaqueAt } from './hitTest'

export function usePixelHitTest() {
  useEffect(() => { preloadAllItems(ITEM_CATALOG) }, [])
  return { isOpaqueAt }
}
