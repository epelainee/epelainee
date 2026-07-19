import { useContext } from 'react'
import { SITE_CONTENT } from '../data/loadSiteContent'
import { ContentContext } from './contentContext'
import type { SiteContent } from './types'

export function useContent(): SiteContent {
  return useContext(ContentContext) ?? SITE_CONTENT
}
