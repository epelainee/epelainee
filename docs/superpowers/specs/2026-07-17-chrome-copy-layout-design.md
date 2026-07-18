# Chrome copy & layout design

Date: 2026-07-17

## Goal

Fill intro (sparkle) and galaxy chrome with Elizabeth’s identity copy, live local time/date, social links, and move “Show all” out of the nav orbit into bottom-left chrome.

## Intro (sparkle)

| Zone | Content |
|------|---------|
| Top-left | `Elizabeth Patricia Elaine` + `Currently in Vancouver, Canada` |
| Bottom-left | Tagline: interactive map of work, interests, experiences |
| Bottom-center | LinkedIn, Instagram, email icons |
| Bottom-right | `{Click\|Tap} the star to explore!` |

Dissolve with burst (opacity + blur), same language as current `NamePlate` / cue.

## Galaxy

| Zone | Content |
|------|---------|
| Top-left | Live local time (tick ~1s) |
| Top-right | Local date (`Friday, July 17`) |
| Bottom-center | Full name + `reach me at epelainee@gmail.com` |
| Bottom-left | **Show all** — only when `path.length > 0` |
| Bottom-right | Esc hint (non-coarse), unchanged |

Settled name block hides while detail panel open.

## Show all

Remove `__all__` from `NavRing`. Fixed bottom-left button calls `showAll()`. Style mirrors esc hint chrome (mono, uppercase, dim).

## Name tracking

Tighten name `letterSpacing` from `0.32em` to `~0.22em`.

## Links

- LinkedIn: `https://www.linkedin.com/in/epelainee`
- Instagram: `http://instagram.com/epelainee`
- Email: `mailto:epelainee@gmail.com`

## Out of scope

No new fonts, no URL routing, no changing orbit geometry beyond removing Show all from the ring.
