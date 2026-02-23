import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react'
import { Z } from '../config'

interface Stroke {
  points: { x: number; y: number }[]
  color: string
  lineWidth: number
}

export interface DrawingCanvasHandle {
  startStroke: (x: number, y: number) => void
  continueStroke: (x: number, y: number) => void
  endStroke: () => void
  undo: () => void
  clear: () => void
}

interface Props {
  refWidth: number
  refHeight: number
  scale: number
  color: string
  onHasStrokesChange?: (has: boolean) => void
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, Props>(
  function DrawingCanvas({ refWidth, refHeight, scale, color, onHasStrokesChange }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const strokes = useRef<Stroke[]>([])
    const currentStroke = useRef<Stroke | null>(null)

    const redrawAll = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const stroke of strokes.current) {
        if (stroke.points.length < 2) continue
        ctx.beginPath()
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.lineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
        }
        ctx.stroke()
      }
    }, [])

    // Redraw when canvas internal size changes
    useEffect(() => {
      redrawAll()
    }, [refWidth, refHeight, redrawAll])

    useImperativeHandle(ref, () => ({
      startStroke(x: number, y: number) {
        const stroke: Stroke = {
          points: [{ x, y }],
          color,
          lineWidth: 6,
        }
        currentStroke.current = stroke
        strokes.current.push(stroke)
      },

      continueStroke(x: number, y: number) {
        const stroke = currentStroke.current
        if (!stroke) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const prev = stroke.points[stroke.points.length - 1]
        stroke.points.push({ x, y })

        // Incremental draw — only the last segment
        ctx.beginPath()
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.lineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      },

      endStroke() {
        currentStroke.current = null
        onHasStrokesChange?.(strokes.current.length > 0)
      },

      undo() {
        if (strokes.current.length === 0) return
        strokes.current.pop()
        redrawAll()
        onHasStrokesChange?.(strokes.current.length > 0)
      },

      clear() {
        strokes.current = []
        currentStroke.current = null
        onHasStrokesChange?.(false)
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      },
    }), [color, onHasStrokesChange])

    return (
      <canvas
        ref={canvasRef}
        width={refWidth}
        height={refHeight}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: refWidth * scale,
          height: refHeight * scale,
          zIndex: Z.drawing,
          pointerEvents: 'none',
        }}
      />
    )
  },
)

export default DrawingCanvas
