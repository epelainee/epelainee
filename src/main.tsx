import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ContentProvider } from './content/ContentProvider'

createRoot(document.getElementById('root')!).render(
  <ContentProvider>
    <App />
  </ContentProvider>,
)
