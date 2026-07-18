import type { CSSProperties } from 'react'
import { CRUSH_DURATION, useStore } from '../state/store'

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
/** Panel open/close dissolve — snappier than the burst. */
const PANEL_MS = 400
const DISSOLVE_BLUR = '12px'

const chrome: CSSProperties = {
  position: 'fixed',
  zIndex: 20,
  margin: 0,
  color: 'var(--dim)',
  textShadow: '0 0 10px #000',
  pointerEvents: 'none',
}

const nameStyle: CSSProperties = {
  font: '400 0.8125rem/1 var(--mono)',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

/**
 * Identity chrome. Intro: top-left name + place, bottom-left tagline.
 * Galaxy: bottom-centre name + email. Dissolves with the burst / panel.
 */
export function NamePlate() {
  const phase = useStore((s) => s.phase)
  const panelOpen = useStore((s) => s.selectedId !== null)
  const intro = phase === 'intro'
  const settled = phase === 'galaxy' || phase === 'crushing'
  const settledVisible = settled && !panelOpen

  const introDissolve = {
    opacity: intro ? 1 : 0,
    filter: intro ? 'blur(0)' : `blur(${DISSOLVE_BLUR})`,
    transition: [
      `opacity ${CRUSH_DURATION}s ${EASE}`,
      `filter ${CRUSH_DURATION}s ${EASE}`,
    ].join(', '),
  }

  return (
    <>
      <div
        aria-hidden={phase !== 'intro'}
        style={{
          ...chrome,
          left: 'max(1.5rem, env(safe-area-inset-left))',
          top: 'max(1.5rem, env(safe-area-inset-top))',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          ...introDissolve,
        }}
      >
        <p style={{ ...nameStyle, margin: 0 }}>Elizabeth&nbsp;Patricia&nbsp;Elaine</p>
        <p
          style={{
            margin: 0,
            font: '400 0.625rem/1.35 var(--mono)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(138, 138, 138, 0.75)',
            maxWidth: '16rem',
            whiteSpace: 'normal',
          }}
        >
          Currently in Vancouver, Canada
        </p>
      </div>

      <p
        aria-hidden={phase !== 'intro'}
        style={{
          ...chrome,
          left: 'max(1.5rem, env(safe-area-inset-left))',
          bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          font: '400 0.6875rem/1.45 var(--mono)',
          letterSpacing: '0.06em',
          maxWidth: 'min(18rem, 42vw)',
          whiteSpace: 'normal',
          ...introDissolve,
        }}
      >
        An interactive map of the work, interests, and experiences that shaped
        me.
      </p>

      <div
        aria-hidden={!settledVisible}
        style={{
          ...chrome,
          left: '50%',
          bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.45rem',
          textAlign: 'center',
          opacity: settledVisible ? 1 : 0,
          filter: settledVisible ? 'blur(0)' : `blur(${DISSOLVE_BLUR})`,
          transition: [
            `opacity ${PANEL_MS}ms ${EASE}`,
            `filter ${PANEL_MS}ms ${EASE}`,
          ].join(', '),
        }}
      >
        <p style={{ ...nameStyle, margin: 0 }}>
          Elizabeth&nbsp;Patricia&nbsp;Elaine
        </p>
        <a
          href="mailto:epelainee@gmail.com"
          style={{
            font: '400 0.625rem/1 var(--mono)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(138, 138, 138, 0.85)',
            textDecoration: 'none',
            pointerEvents: settledVisible ? 'auto' : 'none',
            textShadow: '0 0 10px #000',
          }}
        >
          reach me at epelainee@gmail.com
        </a>
      </div>
    </>
  )
}
