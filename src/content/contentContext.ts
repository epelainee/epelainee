import { createContext } from 'react'
import type { SiteContent } from './types'

export const ContentContext = createContext<SiteContent | null>(null)
