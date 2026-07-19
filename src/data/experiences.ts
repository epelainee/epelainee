import type { CategoryId } from './categories'

export type ExperienceKind = 'internship' | 'certification'

export type Experience = {
  id: string
  title: string
  org: string
  category: CategoryId
  /** Subcategory id (e.g. 'crea-music'). */
  subcategory: string
  /** e.g. "2023" or "2021–2023". Empty string → panel placeholder. */
  dates: string
  /** City / region. Empty string → panel placeholder. */
  location: string
  /** One or two sentences. Empty string → panel placeholder. */
  blurb: string
  /** Omit → default sphere node. internship = 4-pt star, certification = 5-pt. */
  kind?: ExperienceKind
  links?: { label: string; url: string }[]
}

export const byId = (experiences: Experience[], id: string) =>
  experiences.find((e) => e.id === id)
