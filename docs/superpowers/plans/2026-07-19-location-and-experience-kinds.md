# Location + Experience Kinds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `location` to the detail panel (placeholder when empty) and render internship / certification nodes as 4- and 5-point stars.

**Architecture:** Extend `Experience` with `location` and optional `kind`. Detail panel inserts a location line. Galaxy splits nodes into three `InstancedMesh`es (sphere / 4-pt / 5-pt) sharing one layout + live-position buffer; each mesh uses a local instance index mapped back to global layout index.

**Tech Stack:** React, Three.js / R3F, existing Zustand store, no new deps.

## Global Constraints

- Explicit `kind` only — no title heuristics at runtime.
- Empty `location` → placeholder `City, Country` (italic dim, like dates).
- Core 8-spike asymmetric star unchanged.
- Same hover / click / filter / crush behavior for all kinds.

---

### Task 1: Experience data — `location` + `kind`

**Files:**
- Modify: `src/data/experiences.ts`

**Interfaces:**
- Produces: `ExperienceKind`, `location: string`, `kind?: ExperienceKind` on every experience

- [ ] **Step 1: Update type and every experience entry**

Add:

```ts
export type ExperienceKind = 'internship' | 'certification'

export type Experience = {
  id: string
  title: string
  org: string
  category: CategoryId
  subcategory: string
  dates: string
  location: string
  blurb: string
  kind?: ExperienceKind
  links?: { label: string; url: string }[]
}
```

Every object gets `location: ''`. Set `kind: 'internship'` on:

- `accounting-sinarmas`, `culinary-toko-oen`, `uiux-nikola`, `medical-intern-siloam`, `biochem-emmerich`, `horticulture-agritisan`

Set `kind: 'certification'` on `first-aid`.

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b --noEmit`
Expected: errors only in DetailPanel/Galaxy until Tasks 2–3 (or clean if those already tolerate extra fields).

---

### Task 2: Detail panel location line

**Files:**
- Modify: `src/ui/DetailPanel.tsx`

**Interfaces:**
- Consumes: `exp.location`

- [ ] **Step 1: Add location between dates and blurb**

```ts
const LOCATION_PLACEHOLDER = 'City, Country'
// ...
const location = exp.location.trim() || LOCATION_PLACEHOLDER
const locationPlaceholder = !exp.location.trim()
```

Render after dates `<p>`, same style pattern as dates (mono, dim / italic when placeholder).

- [ ] **Step 2: Visual check**

Open any experience → see `City, Country` italic under dates.

---

### Task 3: Star shape helper + Galaxy three meshes

**Files:**
- Create: `src/scene/starShape.ts`
- Modify: `src/scene/Galaxy.tsx`

**Interfaces:**
- Produces: `regularStarShape(points: number, outer: number, innerFrac?: number): Shape`
- Consumes: `byId` / `EXPERIENCES` for `kind`; layout still from `buildLayout()`

- [ ] **Step 1: Create `starShape.ts`**

```ts
import { Shape } from 'three'

/** Regular n-point star in XY, tip up. Outer ≈ sphere radius for visual weight. */
export function regularStarShape(
  points: number,
  outer: number,
  innerFrac = 0.4,
): Shape {
  const s = new Shape()
  const inner = outer * innerFrac
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i * Math.PI) / points - Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  return s
}
```

- [ ] **Step 2: Partition layout indices by kind**

```ts
import { EXPERIENCES } from '../data/experiences'
import { regularStarShape } from './starShape'

// After layout = useMemo(...)
const kindOf = useMemo(() => {
  const m = new Map<string, 'internship' | 'certification' | 'default'>()
  for (const e of EXPERIENCES) {
    m.set(e.id, e.kind ?? 'default')
  }
  return m
}, [])

const groups = useMemo(() => {
  const sphere: number[] = []
  const intern: number[] = []
  const cert: number[] = []
  layout.forEach((n, i) => {
    const k = kindOf.get(n.id) ?? 'default'
    if (k === 'internship') intern.push(i)
    else if (k === 'certification') cert.push(i)
    else sphere.push(i)
  })
  return { sphere, intern, cert }
}, [layout, kindOf])
```

- [ ] **Step 3: Three mesh refs; write matrices per group**

Keep computing `live[i]` for all layout indices in one loop. Then for each group, set instance matrices at local index `j` from global `groups.*(j)`.

Handlers: `onPointerMove` / `onClick` map `e.instanceId` through the group's index array → global layout index → id.

Raycast enable/disable + boundingSphere apply to all three meshes.

Star outer radius: `NODE_RADIUS * 1.35` (flat stars read smaller than spheres of same radius).

Skip empty groups (`args` count 0) — if count is 0, omit that mesh or use count 1 with scale 0; prefer omit when `length === 0`.

- [ ] **Step 4: Verify**

Run: `npx tsc -b --noEmit` → pass.  
Manual: burst → internships 4-pt, first-aid 5-pt, rest spheres; hover/click/filter still work.

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| `location` field + placeholder | 1, 2 |
| Explicit `kind` seeding | 1 |
| Detail panel order | 2 |
| 4-pt / 5-pt / sphere meshes | 3 |
| Shared interaction | 3 |
