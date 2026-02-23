// An item definition (static metadata)
export interface ItemDef {
  id: string
  label: string
  src: string
  width: number   // display width in px on paper
  height: number  // display height in px on paper
}

// Runtime state for each item
export type ItemState = 'tray' | 'free'

export interface ItemData extends ItemDef {
  state: ItemState
  x: number  // position in paper-container coordinates
  y: number
  z: number  // stacking order, higher = on top
}

// DnD constants & types
export const DND_ITEM_TYPE = 'CLOTHING_ITEM'

export interface DragItem {
  id: string
  src: string
  width: number
  height: number
  origin: 'tray' | 'paper'
  offsetX: number
  offsetY: number
}
