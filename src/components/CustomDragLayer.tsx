import { useDragLayer } from 'react-dnd'
import type { DragItem } from '../types'
import { Z } from '../config'

export default function CustomDragLayer() {
  const { item, isDragging, clientOffset } = useDragLayer(monitor => ({
    item: monitor.getItem() as DragItem | null,
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }))

  if (!isDragging || !item || !clientOffset) return null

  const x = clientOffset.x - item.offsetX
  const y = clientOffset.y - item.offsetY

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: Z.dragging,
        width: item.width,
        height: item.height,
        transform: `translate(${x}px, ${y}px)`,
        willChange: 'transform',
        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.25))',
      }}
    >
      <img
        src={item.src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          WebkitUserDrag: 'none',
        } as React.CSSProperties}
        draggable={false}
      />
    </div>
  )
}
