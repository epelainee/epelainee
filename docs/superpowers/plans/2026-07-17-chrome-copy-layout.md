# Chrome Copy & Layout Implementation Plan

> **For agentic workers:** Implement tasks below in order. Check off steps as done.

**Goal:** Ship approved intro/galaxy chrome copy, live clock/date, social icons, and bottom-left Show all.

**Architecture:** Keep dissolve chrome in DOM overlays. Extend `NamePlate` for identity blocks; add small chrome components for clock/date/show-all/socials; thin `App` cue; strip `__all__` from `NavRing`.

**Tech stack:** React 19, Zustand store (unchanged API), existing CSS vars (`--mono`, `--dim`, `--fg`).

---

### Task 1: NamePlate + intro/galaxy identity

**Files:** `src/ui/NamePlate.tsx`

- Letter-spacing `0.22em`
- Intro: full name + Vancouver line top-left; tagline bottom-left
- Galaxy: name + mailto line bottom-center; hide when panel open
- Keep dissolve transitions

### Task 2: Social icons (intro)

**Files:** create `src/ui/SocialLinks.tsx`; wire from `App` or `NamePlate`

- Bottom-center intro only
- LinkedIn / Instagram / mail SVGs, `target=_blank` where external

### Task 3: Galaxy clock + date

**Files:** create `src/ui/LocalClock.tsx` (or split)

- Top-left time, top-right date, `phase === 'galaxy'`
- `setInterval` 1s; format with `toLocaleTimeString` / `toLocaleDateString`

### Task 4: Show all chrome + NavRing cleanup

**Files:** `src/ui/ShowAll.tsx` (or inline App), `src/ui/NavRing.tsx`, `src/App.tsx`

- Bottom-left button when galaxy + path non-empty
- Remove orbit `__all__` item
- Update intro cue copy to “explore!”

### Task 5: Verify

- `npm run build`
- Manual: intro layout, burst dissolve, galaxy clock, drill → Show all bottom-left, panel hides name
