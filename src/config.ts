import type { ItemDef } from './types'

// Размеры подобраны под листочек 400×520px
// Динозавр 707×982 → уменьшен до 340×472 (коэф. ~0.48)
// Одежда масштабирована примерно в тот же коэф. ~0.45–0.48

export const ITEM_CATALOG: ItemDef[] = [
  { id: 'boots1',   label: 'Boots 1',   src: '/assets/items/boots1.png',   width: 214, height: 94  },
  { id: 'boots2',   label: 'Boots 2',   src: '/assets/items/boots2.png',   width: 196, height: 93  },
  { id: 'clothes1', label: 'Clothes 1', src: '/assets/items/clothes1.png', width: 215, height: 180 },
  { id: 'clothes2', label: 'Clothes 2', src: '/assets/items/clothes2.png', width: 262, height: 198 },
  { id: 'clothes3', label: 'Clothes 3', src: '/assets/items/clothes3.png', width: 228, height: 214 },
  { id: 'clothes4', label: 'Clothes 4', src: '/assets/items/clothes4.png', width: 204, height: 102 },
  { id: 'mask1',    label: 'Mask 1',    src: '/assets/items/mask1.png',    width: 352, height: 154 },
  { id: 'mask2',    label: 'Mask 2',    src: '/assets/items/mask2.png',    width: 311, height: 215 },
  { id: 'mask3',    label: 'Mask 3',    src: '/assets/items/mask3.png',    width: 329, height: 289 },
]

// Dino display width that item sizes in ITEM_CATALOG were designed for (707 * ~0.48)
export const DINO_REFERENCE_WIDTH = 340

export const Z = {
  paper:    0,
  dino:     10,
  drawing:  15,
  freeItem: 20,
  dragging: 100,
} as const

export const DRAWING_COLORS = ['#000000', '#e53935', '#1e88e5', '#43a047', '#ffffff', '#fdd835']
