# Location + experience kind shapes

## Goal

1. Show **location** in the experience detail panel (with placeholder while empty).
2. Visually distinguish **internships** (4-point star) and **certifications** (5-point star) from default experience nodes (sphere).

## Data

In `src/data/experiences.ts`:

```ts
export type ExperienceKind = 'internship' | 'certification'

export type Experience = {
  // ...existing fields...
  /** City / region. Empty string → panel shows placeholder. */
  location: string
  /** Omit or undefined → default sphere node. */
  kind?: ExperienceKind
}
```

### Initial seeding

- Set `kind: 'internship'` on experiences whose titles are clearly internships (Accounting, Culinary, UI/UX, Medical, Biochemistry Research, Horticulture).
- Set `kind: 'certification'` on `first-aid` (First Aid Certified).
- All others omit `kind`.
- All `location` values start as `''` for later fill-in.

Kinds are explicit tags, not title heuristics — future edits only change the field.

## Detail panel

Order (unchanged except location inserted):

1. title (position)
2. org (company)
3. dates
4. **location**
5. blurb
6. links (if any)

Empty `location` shows placeholder `City, Country` — italic, dimmed — same treatment as empty dates/blurb.

## Galaxy nodes

Today: one `InstancedMesh` with `sphereGeometry` for every experience.

### Approach

Three `InstancedMesh`es sharing the same layout / crush / hover / filter logic:

| Kind | Geometry |
|------|----------|
| default (no `kind`) | sphere (current) |
| `internship` | flat regular 4-point star |
| `certification` | flat regular 5-point star |

- Stars are extrude/shape meshes in the XY plane (face camera), sized to read at similar visual weight as `NODE_RADIUS` spheres.
- Shared helper builds a regular n-point star `Shape` (equal spike length). Core’s asymmetric 8-spike star is unchanged.
- Picking / hover / click: each mesh maps `instanceId` → experience via a precomputed index list for that kind.
- Animation (collapse, breathe, hover scale, filter fade): identical per mesh; only geometry differs.

### Out of scope

- Changing dust / shell / intro star.
- Filling real location strings.
- Legend UI explaining shapes (can add later if needed).
- Wrapping / Esc+click label bugs (separate).

## Acceptance

1. Detail panel always shows a location line; blank data → `City, Country` placeholder.
2. Internship nodes render as 4-point stars; certification as 5-point; all others spheres.
3. Hover, click, filter, and burst behavior match current spheres for all kinds.
4. Adding/removing `kind` on an experience changes only that node’s shape.
