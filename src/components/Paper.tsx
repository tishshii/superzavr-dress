import { useRef, useCallback, useState, useEffect, type RefObject } from 'react'
import { useDrop } from 'react-dnd'
import type { ItemData, DragItem } from '../types'
import { DND_ITEM_TYPE } from '../types'
import { DINO_REFERENCE_WIDTH } from '../config'
import PaperDragOverlay from './PaperDragOverlay'
import DrawingCanvas, { type DrawingCanvasHandle } from './DrawingCanvas'
import dino from '../assets/dino.png'

interface Props {
  items: ItemData[]
  draggingId: string | null
  onItemDropped: (id: string, refX: number, refY: number) => void
  onDragStart: (id: string) => void
  onDragEnd: (id: string, didDrop: boolean) => void
  onScaleChange: (scale: number) => void
  drawingEnabled: boolean
  drawingColor: string
  drawingCanvasRef: RefObject<DrawingCanvasHandle | null>
  onHasStrokesChange: (has: boolean) => void
}

export default function Paper({ items, draggingId, onItemDropped, onDragStart, onDragEnd, onScaleChange, drawingEnabled, drawingColor, drawingCanvasRef, onHasStrokesChange }: Props) {
  const paperRef = useRef<HTMLDivElement | null>(null)
  const dinoRef = useRef<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [paperRefSize, setPaperRefSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    const img = dinoRef.current
    if (!img) return

    const update = () => {
      const w = img.clientWidth
      if (w > 0) {
        const s = w / DINO_REFERENCE_WIDTH
        setScale(s)
        onScaleChange(s)
      }
    }

    const observer = new ResizeObserver(update)
    observer.observe(img)
    return () => observer.disconnect()
  }, [onScaleChange])

  // Track paper size in reference space
  useEffect(() => {
    const el = paperRef.current
    if (!el) return

    const update = () => {
      const s = scale || 1
      setPaperRefSize({
        w: el.clientWidth / s,
        h: el.clientHeight / s,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [scale])

  const scaleRef = useRef(scale)
  scaleRef.current = scale

  const [, dropRef] = useDrop<DragItem, void, Record<string, never>>(() => ({
    accept: DND_ITEM_TYPE,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !paperRef.current) return
      const r = paperRef.current.getBoundingClientRect()
      const paperX = offset.x - r.left
      const paperY = offset.y - r.top
      const s = scaleRef.current
      const refX = (paperX - item.offsetX) / s
      const refY = (paperY - item.offsetY) / s
      onItemDropped(item.id, refX, refY)
    },
  }), [onItemDropped])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    paperRef.current = el
    dropRef(el)
  }, [dropRef])

  const activeItems = items.filter(i => i.state === 'free')

  return (
    <div className="paper" ref={setRef}>
      <img ref={dinoRef} src={dino} alt="Dino" className="dino" draggable={false} />

      {paperRefSize.w > 0 && paperRefSize.h > 0 && (
        <DrawingCanvas
          ref={drawingCanvasRef as React.Ref<DrawingCanvasHandle>}
          refWidth={paperRefSize.w}
          refHeight={paperRefSize.h}
          scale={scale}
          color={drawingColor}
          onHasStrokesChange={onHasStrokesChange}
        />
      )}

      {activeItems.map(item => (
        <div
          key={item.id}
          className="item-on-paper"
          style={{
            left: item.x * scale,
            top: item.y * scale,
            width: item.width * scale,
            height: item.height * scale,
            zIndex: item.z,
            opacity: draggingId === item.id ? 0 : 1,
          }}
        >
          <img src={item.src} alt={item.label} draggable={false} />
        </div>
      ))}

      <PaperDragOverlay
        items={items}
        scale={scale}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        drawingEnabled={drawingEnabled}
        drawingCanvasRef={drawingCanvasRef}
      />
    </div>
  )
}
