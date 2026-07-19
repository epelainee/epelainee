/**
 * Chrome / meta / placeholder types.
 * Data lives in `content/site-settings.json` (Pages CMS).
 */
export type SocialIcon = 'linkedin' | 'instagram' | 'email' | 'other'

export type SocialLink = {
  label: string
  url: string
  icon: SocialIcon
}

export type SiteSettings = {
  displayName: string
  locationLine: string
  tagline: string
  pageTitle: string
  pageDescription: string
  socialLinks: SocialLink[]
  placeholders: {
    org: string
    dates: string
    location: string
    blurb: string
  }
  hubTips: {
    introAria: string
    filterByCategory: string
    hideFilters: string
  }
}
