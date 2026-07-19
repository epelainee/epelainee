import { Shape } from 'three'

/**
 * Regular n-point star in the XY plane, tip up.
 *
 * Outer radius should be a bit larger than a sphere's NODE_RADIUS so the flat
 * silhouette reads at similar visual weight under the halftone.
 */
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
