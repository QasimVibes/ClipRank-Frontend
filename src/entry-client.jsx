import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const container = document.getElementById('root')

// SSR pages have pre-rendered HTML in #root; hydrate them.
// All other routes were served the bare index.html (empty root), so we mount normally.
const ssrRoutes = ['/', '/privacy-policy']
const isSSRPage = ssrRoutes.includes(window.location.pathname)

const app = (
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)

if (isSSRPage && container.innerHTML.trim() !== '') {
  // Hydrate the server-rendered markup so React can take over.
  hydrateRoot(container, app)
} else {
  // Plain client-side mount for authenticated/protected routes.
  createRoot(container).render(app)
}

// Smoothly fade out the simple blur overlay to prevent FOUC elegantly
const overlay = document.getElementById('cliprank-overlay')
if (overlay) {
  // Give React a brief moment to render the real DOM behind the overlay
  setTimeout(() => {
    overlay.style.opacity = '0'
    overlay.style.visibility = 'hidden'
    
    // Remove from DOM completely after fade out finishes
    setTimeout(() => {
      overlay.remove()
    }, 650)
  }, 100)
}
