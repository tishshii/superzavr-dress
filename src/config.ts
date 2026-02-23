import type { ItemDef } from './types'
import boots1 from './assets/boots1.png'
import boots2 from './assets/boots2.png'
import clothes1 from './assets/clothes1.png'
import clothes2 from './assets/clothes2.png'
import clothes3 from './assets/clothes3.png'
import clothes4 from './assets/clothes4.png'
import mask1 from './assets/mask1.png'
import mask2 from './assets/mask2.png'
import mask3 from './assets/mask3.png'

// Размеры подобраны под листочек 400×520px
// Динозавр 707×982 → уменьшен до 340×472 (коэф. ~0.48)
// Одежда масштабирована примерно в тот же коэф. ~0.45–0.48

export const ITEM_CATALOG: ItemDef[] = [
  { id: 'boots1',   label: 'Boots 1',   src: boots1,   width: 214, height: 94  },
  { id: 'boots2',   label: 'Boots 2',   src: boots2,   width: 196, height: 93  },
  { id: 'clothes1', label: 'Clothes 1', src: clothes1, width: 215, height: 180 },
  { id: 'clothes2', label: 'Clothes 2', src: clothes2, width: 262, height: 198 },
  { id: 'clothes3', label: 'Clothes 3', src: clothes3, width: 228, height: 214 },
  { id: 'clothes4', label: 'Clothes 4', src: clothes4, width: 204, height: 102 },
  { id: 'mask1',    label: 'Mask 1',    src: mask1,    width: 352, height: 154 },
  { id: 'mask2',    label: 'Mask 2',    src: mask2,    width: 311, height: 215 },
  { id: 'mask3',    label: 'Mask 3',    src: mask3,    width: 329, height: 289 },
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
