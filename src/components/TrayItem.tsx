import { useDrag } from 'react-dnd'
import type { ItemData, DragItem } from '../types'
import { DND_ITEM_TYPE } from '../types'

interface Props {
  item: ItemData
  scale: number
  onDragEnd: (id: string, didDrop: boolean) => void
}

export default function TrayItem({ item, scale, onDragEnd }: Props) {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: DND_ITEM_TYPE,
    item: {
      id: item.id,
      src: item.src,
      width: item.width * scale,
      height: item.height * scale,
      origin: 'tray' as const,
      offsetX: (item.width * scale) / 2,
      offsetY: (item.height * scale) / 2,
    },
    end: (_item, monitor) => {
      onDragEnd(item.id, monitor.didDrop())
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item.id, item.src, item.width, item.height, scale, onDragEnd])

  return (
    <div
      ref={dragRef}
      className="tray-item"
      style={{ opacity: isDragging ? 0 : 1 }}
      title={item.label}
    >
      <img src={item.src} alt={item.label} draggable={false} />
    </div>
  )
}
