/**
 * Category hierarchy types + helpers.
 * Data lives in `content/categories/` and `content/subcategories/` (Pages CMS).
 */
export type CategoryId = string

export type SubCategory = { id: string; label: string }
export type MainCategory = {
  id: CategoryId
  label: string
  subs: SubCategory[]
}

export function categoryById(
  categories: MainCategory[],
  id: CategoryId,
): MainCategory | undefined {
  return categories.find((c) => c.id === id)
}

export function categoryLabel(categories: MainCategory[], id: CategoryId): string {
  return categoryById(categories, id)?.label ?? id
}

export function subLabel(categories: MainCategory[], id: string): string {
  for (const c of categories) {
    const sub = c.subs.find((s) => s.id === id)
    if (sub) return sub.label
  }
  return id
}

/** Ring radius index for a category (its position in the categories array). */
export function categoryOrder(categories: MainCategory[], id: CategoryId): number {
  const i = categories.findIndex((c) => c.id === id)
  return i < 0 ? 0 : i
}
