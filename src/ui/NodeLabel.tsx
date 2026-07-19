import { Html } from '@react-three/drei'
import { useStore } from '../state/store'
import { byId } from '../data/experiences'
import { useContent } from '../content/useContent'

/**
 * The hover/tap label.
 *
 * Rendered as DOM rather than as scene geometry so it never passes through the
 * halftone: dot-screened text is unreadable. Its 3D parent group is moved onto
 * the hovered node each frame, so it tracks a moving orbit without React
 * re-rendering per frame.
 *
 * Only one label exists at a time — the hovered one — so 60+ nodes cost nothing.
 */
export function NodeLabel() {
  const { experiences } = useContent()
  const phase = useStore((s) => s.phase)
  const hoveredId = useStore((s) => s.hoveredId)
  const selectedId = useStore((s) => s.selectedId)

  // Labels only belong to the settled field. After Esc collapse, hoveredId can
  // still be set for a frame (or longer if pointerOut never fires) — hide then.
  // The panel already names the selected experience; a label on top is clutter.
  if (phase !== 'galaxy' || !hoveredId || hoveredId === selectedId) return null

  const exp = byId(experiences, hoveredId)
  if (!exp) return null

  return (
    <Html
      center
      zIndexRange={[20, 10]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div
        style={{
          transform: 'translateY(-2.1em)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          color: 'var(--fg)',
          textShadow: '0 0 12px #000, 0 0 4px #000',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: '0.02em' }}>{exp.title}</div>
        {exp.org && (
          <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2 }}>
            {exp.org}
          </div>
        )}
      </div>
    </Html>
  )
}
