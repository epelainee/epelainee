import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { categoryById } from '../data/categories'
import type { CategoryId } from '../data/categories'
import { useContent } from '../content/useContent'
import { useStore } from '../state/store'

/**
 * The ring of category / subcategory choices around the central hub.
 *
 * Shows exactly one level: categories at root, then the entered category's
 * subcategories. Esc / Backspace steps back via `back()`.
 *
 * The central star opens and closes it (`ringOpen`). Selections deliberately do
 * not close it, so drilling category -> subcategory is one continuous motion
 * rather than a trip back to the centre for every step.
 *
 * DOM rather than 3D: it never passes through the halftone, so the labels stay
 * crisp, and it keeps the one interactive 3D object — the central star — clean.
 * The container ignores the pointer; only the buttons catch it, so hovering the
 * galaxy between buttons still works.
 */
const RING = 'clamp(7.5rem, 26vmin, 12rem)'
const PANEL_MS = 520
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const STAGGER_MS = 28

type Item = { id: string; label: string; count: number; active: boolean }

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function NavRing() {
  const { categories, experiences } = useContent()
  const phase = useStore((s) => s.phase)
  const ringOpen = useStore((s) => s.ringOpen)
  const path = useStore((s) => s.path)
  const enterCategory = useStore((s) => s.enterCategory)
  const enterSub = useStore((s) => s.enterSub)

  const { categoryCounts, subCounts } = useMemo(() => {
    const categoryCounts = new Map<CategoryId, number>()
    const subCounts = new Map<string, number>()
    for (const e of experiences) {
      categoryCounts.set(e.category, (categoryCounts.get(e.category) ?? 0) + 1)
      subCounts.set(e.subcategory, (subCounts.get(e.subcategory) ?? 0) + 1)
    }
    return { categoryCounts, subCounts }
  }, [experiences])

  const wantOpen = phase === 'galaxy' && ringOpen
  const [mounted, setMounted] = useState(wantOpen)
  const [visible, setVisible] = useState(wantOpen)
  // Remount buttons when the filter level changes so they restagger in.
  const levelKey = path.length === 0 ? 'root' : path.join('/')

  // Drop to dematerialised before paint when the filter level swaps, so new
  // buttons don't flash in at full opacity for a frame.
  useLayoutEffect(() => {
    if (!wantOpen || prefersReducedMotion()) return
    setVisible(false)
  }, [levelKey, wantOpen])

  useEffect(() => {
    if (wantOpen) {
      setMounted(true)
      if (prefersReducedMotion()) {
        setVisible(true)
        return
      }
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }

    setVisible(false)
    if (prefersReducedMotion()) {
      setMounted(false)
      return
    }
    const t = window.setTimeout(() => setMounted(false), PANEL_MS)
    return () => window.clearTimeout(t)
  }, [wantOpen, levelKey])

  if (!mounted) return null

  // The level currently shown: categories at root, else the category's subs.
  let items: Item[]
  let onPick: (item: Item) => void
  if (path.length === 0) {
    items = categories.map((c) => ({
      id: c.id,
      label: c.label,
      count: categoryCounts.get(c.id) ?? 0,
      active: false,
    }))
    onPick = (item) => enterCategory(item.id)
  } else {
    const cat = categoryById(categories, path[0] as CategoryId)
    items = (cat?.subs ?? []).map((s) => ({
      id: s.id,
      label: s.label,
      count: subCounts.get(s.id) ?? 0,
      active: path[1] === s.id,
    }))
    onPick = (item) => enterSub(item.id)
  }

  const reduced = prefersReducedMotion()

  return (
    <div
      id="nav-ring"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 25,
        pointerEvents: 'none',
      }}
    >
      {items.map((item, i) => {
        // Start at the top, go clockwise.
        const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2
        const delay = reduced ? 0 : i * STAGGER_MS
        return (
          <div
            key={`${levelKey}-${item.id}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: visible
                ? `translate(-50%, -50%) translate(calc(cos(${angle}rad) * ${RING}), calc(sin(${angle}rad) * ${RING})) scale(1)`
                : `translate(-50%, -50%) translate(calc(cos(${angle}rad) * ${RING}), calc(sin(${angle}rad) * ${RING})) scale(0.82)`,
              opacity: visible ? 1 : 0,
              pointerEvents: visible ? 'auto' : 'none',
              transition: reduced
                ? undefined
                : [
                    `opacity ${PANEL_MS}ms ${EASE} ${delay}ms`,
                    `transform ${PANEL_MS}ms ${EASE} ${delay}ms`,
                  ].join(', '),
            }}
          >
            <button
              type="button"
              onClick={() => onPick(item)}
              aria-pressed={item.active}
              className="nav-ring-btn"
              style={{
                background: item.active ? 'var(--fg)' : 'rgba(0,0,0,0.55)',
                color: item.active ? '#000' : 'var(--fg)',
                border: `1px solid ${
                  item.active ? 'var(--fg)' : 'rgba(255,255,255,0.35)'
                }`,
                borderRadius: '999px',
                padding: '0.4rem 0.85rem',
                font: '400 0.6875rem/1 var(--mono)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                backdropFilter: 'blur(3px)',
                textShadow: item.active ? 'none' : '0 0 8px #000',
                transition: reduced
                  ? undefined
                  : [
                      `background 220ms ${EASE}`,
                      `color 220ms ${EASE}`,
                      `border-color 220ms ${EASE}`,
                      `transform 180ms ${EASE}`,
                    ].join(', '),
              }}
            >
              {item.label} ({item.count})
            </button>
          </div>
        )
      })}
    </div>
  )
}
