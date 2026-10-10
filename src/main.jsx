import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin'

// The admin pages live under /admin; everything else is the kiosk.
const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname)
document.documentElement.dataset.app = isAdmin ? 'admin' : 'kiosk'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Suspense fallback={null}>
          <AdminApp />
        </Suspense>
      ) : (
        <App />
      )}
    </QueryClientProvider>
  </StrictMode>,
)
