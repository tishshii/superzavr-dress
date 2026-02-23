import { useRef, useState, useCallback } from 'react'
import { useDragLayer } from 'react-dnd'
import type { ItemData } from './types'
import { ITEM_CATALOG, Z, DRAWING_COLORS } from './config'
import { usePixelHitTest } from './usePixelHitTest'
import TrayItem from './components/TrayItem'
import Paper from './components/Paper'
import CustomDragLayer from './components/CustomDragLayer'
import ColorPicker from './components/ColorPicker'
import type { DrawingCanvasHandle } from './components/DrawingCanvas'
import './App.css'

function initItems(): ItemData[] {
  return ITEM_CATALOG.map(def => ({
    ...def,
    state: 'tray',
    x: 0,
    y: 0,
    z: Z.freeItem,
  }))
}

export default function App() {
  const [items, setItems] = useState<ItemData[]>(initItems)
  const [scale, setScale] = useState(1)
  const [drawingColor, setDrawingColor] = useState(DRAWING_COLORS[0])
  const [hasStrokes, setHasStrokes] = useState(false)
  const zCounter = useRef(Z.freeItem)
  const drawingCanvasRef = useRef<DrawingCanvasHandle>(null)
  usePixelHitTest()

  const { draggingId } = useDragLayer(monitor => {
    const item = monitor.getItem()
    return { draggingId: monitor.isDragging() && item ? (item as { id: string }).id : null }
  })

  const handleItemDropped = useCallback((id: string, refX: number, refY: number) => {
    const z = ++zCounter.current
    setItems(prev => prev.map(i =>
      i.id === id
        ? { ...i, state: 'free' as const, x: refX, y: refY, z }
        : i
    ))
  }, [])

  const handleDragEnd = useCallback((id: string, didDrop: boolean) => {
    if (!didDrop) {
      setItems(prev => prev.map(i =>
        i.id === id ? { ...i, state: 'tray' as const, x: 0, y: 0 } : i
      ))
    }
  }, [])

  const handleDragStart = useCallback((id: string) => {
    const z = ++zCounter.current
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, z } : i
    ))
  }, [])

  const handleColorChange = useCallback((color: string) => {
    setDrawingColor(color)
  }, [])

  const handleUndo = useCallback(() => {
    drawingCanvasRef.current?.undo()
  }, [])

  const handleClearDrawing = useCallback(() => {
    drawingCanvasRef.current?.clear()
    setHasStrokes(false)
  }, [])

  const trayItems = items.filter(i => i.state === 'tray')
  const hasItemsOnPaper = items.some(i => i.state === 'free')

  const handleResetItems = useCallback(() => {
    zCounter.current = Z.freeItem
    setItems(initItems())
  }, [])

  return (
    <div className="app">
      <div className="toolbar">
        <ColorPicker
          color={drawingColor}
          hasStrokes={hasStrokes}
          onColorChange={handleColorChange}
          onUndo={handleUndo}
          onClear={handleClearDrawing}
        />
      </div>

      <Paper
        items={items}
        draggingId={draggingId}
        onItemDropped={handleItemDropped}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onScaleChange={setScale}
        drawingEnabled
        drawingColor={drawingColor}
        drawingCanvasRef={drawingCanvasRef}
        onHasStrokesChange={setHasStrokes}
      />

      <div className="tray-items">
        {trayItems.map(item => (
          <TrayItem
            key={item.id}
            item={item}
            scale={scale}
            onDragEnd={handleDragEnd}
          />
        ))}
        {hasItemsOnPaper && (
          <button className="btn-reset" onClick={handleResetItems} aria-label="Reset items">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
        )}
      </div>

      <CustomDragLayer />
    </div>
  )
}
