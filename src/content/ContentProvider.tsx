import { useEffect, type ReactNode } from 'react'
import { SITE_CONTENT } from '../data/loadSiteContent'
import { ContentContext } from './contentContext'

export function ContentProvider({ children }: { children: ReactNode }) {
  const content = SITE_CONTENT

  useEffect(() => {
    const { pageTitle, pageDescription } = content.siteSettings
    document.title = pageTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', pageDescription)
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', pageTitle)
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', pageDescription)
    const twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', pageTitle)
    const twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', pageDescription)
  }, [content])

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  )
}
