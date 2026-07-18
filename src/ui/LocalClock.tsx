import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useStore } from '../state/store'

const chrome: CSSProperties = {
  position: 'fixed',
  zIndex: 20,
  margin: 0,
  font: '400 0.625rem/1 var(--mono)',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--dim)',
  textShadow: '0 0 8px #000',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
}

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Galaxy chrome: local time top-left, local date top-right.
 */
export function LocalClock() {
  const phase = useStore((s) => s.phase)
  const visible = phase === 'galaxy'
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!visible) return
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [visible])

  if (!visible) return null

  return (
    <>
      <p
        aria-live="polite"
        style={{
          ...chrome,
          left: 'max(1.5rem, env(safe-area-inset-left))',
          top: 'max(1.5rem, env(safe-area-inset-top))',
        }}
      >
        {formatTime(now)}
      </p>
      <p
        style={{
          ...chrome,
          right: 'max(1.5rem, env(safe-area-inset-right))',
          top: 'max(1.5rem, env(safe-area-inset-top))',
        }}
      >
        {formatDate(now)}
      </p>
    </>
  )
}
