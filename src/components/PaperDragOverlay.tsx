import { useRef, useCallback, type RefObject } from 'react'
import { useDrag } from 'react-dnd'
import type { ItemData, DragItem } from '../types'
import { DND_ITEM_TYPE } from '../types'
import { isOpaqueAt } from '../hitTest'
import type { DrawingCanvasHandle } from './DrawingCanvas'

interface Props {
  items: ItemData[]
  scale: number
  onDragStart: (id: string) => void
  onDragEnd: (id: string, didDrop: boolean) => void
  drawingEnabled: boolean
  drawingCanvasRef: RefObject<DrawingCanvasHandle | null>
}

export default function PaperDragOverlay({ items, scale, onDragStart, onDragEnd, drawingEnabled, drawingCanvasRef }: Props) {
  const pointerPos = useRef<{ x: number; y: number } | null>(null)
  const paperEl = useRef<HTMLDivElement | null>(null)
  const isDrawing = useRef(false)
  const drawingPointerId = useRef<number | null>(null)

  const toRefCoords = useCallback((clientX: number, clientY: number) => {
    const el = paperEl.current?.parentElement
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      refX: (clientX - r.left) / scale,
      refY: (clientY - r.top) / scale,
    }
  }, [scale])

  const findHitItem = useCallback((clientX: number, clientY: number): ItemData | null => {
    const coords = toRefCoords(clientX, clientY)
    if (!coords) return null

    const onPaper = items
      .filter(i => i.state === 'free')
      .sort((a, b) => b.z - a.z)

    for (const item of onPaper) {
      const lx = coords.refX - item.x
      const ly = coords.refY - item.y
      if (lx < 0 || ly < 0 || lx >= item.width || ly >= item.height) continue
      if (isOpaqueAt(item.id, lx, ly)) return item
    }
    return null
  }, [items, scale, toRefCoords])

  const [, dragRef] = useDrag<DragItem, void, Record<string, never>>(() => ({
    type: DND_ITEM_TYPE,
    canDrag: () => {
      if (isDrawing.current) return false
      if (!pointerPos.current) return false
      return findHitItem(pointerPos.current.x, pointerPos.current.y) !== null
    },
    item: () => {
      if (!pointerPos.current) return null
      const hit = findHitItem(pointerPos.current.x, pointerPos.current.y)
      if (!hit) return null

      const el = paperEl.current?.parentElement
      if (!el) return null
      const r = el.getBoundingClientRect()
      const paperX = pointerPos.current.x - r.left
      const paperY = pointerPos.current.y - r.top

      // Offset in paper-space pixels (scaled)
      const offsetX = paperX - hit.x * scale
      const offsetY = paperY - hit.y * scale

      onDragStart(hit.id)

      return {
        id: hit.id,
        src: hit.src,
        width: hit.width * scale,
        height: hit.height * scale,
        origin: 'paper' as const,
        offsetX,
        offsetY,
      }
    },
    end: (item, monitor) => {
      if (item) {
        onDragEnd(item.id, monitor.didDrop())
      }
    },
  }), [findHitItem, scale, onDragStart, onDragEnd])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    paperEl.current = el
    dragRef(el)
  }, [dragRef])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerPos.current = { x: e.clientX, y: e.clientY }

    // If an item is under the pointer, let DnD handle it
    const hit = findHitItem(e.clientX, e.clientY)
    if (hit) return

    // If drawing mode enabled and no item hit, start drawing
    if (drawingEnabled && drawingCanvasRef.current) {
      // Ignore additional pointers while drawing
      if (isDrawing.current) return

      const coords = toRefCoords(e.clientX, e.clientY)
      if (!coords) return

      isDrawing.current = true
      drawingPointerId.current = e.pointerId
      drawingCanvasRef.current.startStroke(coords.refX, coords.refY)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      e.preventDefault()
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return
    if (e.pointerId !== drawingPointerId.current) return

    const coords = toRefCoords(e.clientX, e.clientY)
    if (!coords) return

    drawingCanvasRef.current?.continueStroke(coords.refX, coords.refY)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing.current) return
    if (e.pointerId !== drawingPointerId.current) return

    drawingCanvasRef.current?.endStroke()
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    isDrawing.current = false
    drawingPointerId.current = null
  }

  return (
    <div
      ref={setRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
      }}
    />
  )
}
