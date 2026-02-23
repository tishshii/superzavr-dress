import { DRAWING_COLORS } from '../config'

interface Props {
  color: string
  hasStrokes: boolean
  onColorChange: (color: string) => void
  onUndo: () => void
  onClear: () => void
}

function UndoIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M3 13c0 0 2.5-8 11-8a9 9 0 0 1 7 3.5" />
    </svg>
  )
}

function ResetIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

export default function ColorPicker({ color, hasStrokes, onColorChange, onUndo, onClear }: Props) {
  return (
    <div className="color-picker">
      {DRAWING_COLORS.map(c => (
        <button
          key={c}
          className={`color-swatch${c === color ? ' selected' : ''}`}
          style={{ backgroundColor: c }}
          onClick={() => onColorChange(c)}
          aria-label={`Color ${c}`}
        />
      ))}

      {hasStrokes && (
        <>
          <button
            className="btn-tool"
            onClick={onUndo}
            aria-label="Undo last stroke"
          >
            <UndoIcon color="#999" />
          </button>
          <button
            className="btn-tool"
            onClick={onClear}
            aria-label="Clear drawing"
          >
            <ResetIcon color="#999" />
          </button>
        </>
      )}
    </div>
  )
}
