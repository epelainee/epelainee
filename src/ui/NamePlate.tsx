import type { CSSProperties } from 'react'
import { CRUSH_DURATION, useStore } from '../state/store'
import { useContent } from '../content/useContent'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/** Panel open/close dissolve — soft settle, not a hard cut. */
const PANEL_MS = 520
const DISSOLVE_BLUR = '12px'

const chrome: CSSProperties = {
  position: 'fixed',
  zIndex: 20,
  margin: 0,
  color: 'rgba(255, 255, 255, 0.92)',
  textShadow: '0 0 10px #000',
  pointerEvents: 'none',
}

const nameStyle: CSSProperties = {
  font: '400 0.8125rem/1 var(--mono)',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

/** Keep multi-word names from wrapping mid-word awkwardly. */
function nbspName(name: string) {
  return name.replace(/ /g, '\u00a0')
}

/**
 * Identity chrome. Intro: top-left name + place, bottom-left tagline.
 * Galaxy: bottom-centre name. Dissolves with the burst / panel.
 */
export function NamePlate() {
  const { siteSettings } = useContent()
  const phase = useStore((s) => s.phase)
  const panelOpen = useStore((s) => s.selectedId !== null)
  const intro = phase === 'intro'
  const settled = phase === 'galaxy' || phase === 'crushing'
  const settledVisible = settled && !panelOpen
  const displayName = nbspName(siteSettings.displayName)

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
          left: 'max(1.25rem, env(safe-area-inset-left))',
          top: 'max(1.25rem, env(safe-area-inset-top))',
          right: 'max(5.5rem, env(safe-area-inset-right))',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          ...introDissolve,
        }}
      >
        <p
          style={{
            ...nameStyle,
            margin: 0,
            whiteSpace: 'normal',
            maxWidth: '100%',
          }}
        >
          {displayName}
        </p>
        <p
          style={{
            margin: 0,
            font: '400 0.625rem/1.35 var(--mono)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.78)',
            maxWidth: '16rem',
            whiteSpace: 'normal',
          }}
        >
          {siteSettings.locationLine}
        </p>
      </div>

      <p
        aria-hidden={phase !== 'intro'}
        style={{
          ...chrome,
          left: 'max(1.25rem, env(safe-area-inset-left))',
          bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
          right: 'max(1.25rem, env(safe-area-inset-right))',
          font: '400 0.6875rem/1.45 var(--mono)',
          letterSpacing: '0.06em',
          // Wide enough for two lines; leave room for the intro cue on the right.
          maxWidth: 'min(22rem, calc(100vw - 12rem))',
          whiteSpace: 'normal',
          ...introDissolve,
        }}
      >
        {siteSettings.tagline}
      </p>

      <div
        aria-hidden={!settledVisible}
        style={{
          ...chrome,
          left: '50%',
          // Low under the field — clears the galaxy shell, sits with bottom chrome.
          bottom:
            'max(1.75rem, calc(env(safe-area-inset-bottom) + 1.25rem))',
          transform: settledVisible
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 'min(72vw, 20rem)',
          padding: '0 0.5rem',
          opacity: settledVisible ? 1 : 0,
          filter: settledVisible ? 'blur(0)' : `blur(${DISSOLVE_BLUR})`,
          transition: [
            `opacity ${PANEL_MS}ms ${EASE}`,
            `filter ${PANEL_MS}ms ${EASE}`,
            `transform ${PANEL_MS}ms ${EASE}`,
          ].join(', '),
        }}
      >
        <p
          style={{
            ...nameStyle,
            margin: 0,
            font: '400 1rem/1.15 var(--mono)',
            letterSpacing: '0.18em',
            whiteSpace: 'normal',
          }}
        >
          {displayName}
        </p>
      </div>
    </>
  )
}
