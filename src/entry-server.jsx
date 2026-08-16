import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'

/**
 * Renders the requested URL to an HTML string and returns the page's head
 * metadata so the Express server can inject both into the index.html template.
 *
 * @param {string} url  The request URL (e.g. "/" or "/privacy-policy")
 * @returns {{ html: string, head: string }}
 */
export function render(url) {
  // SSR AuthContext: always unauthenticated / not-loading on the server so
  // pages render their full public content (not a spinner or redirect).
  const html = renderToString(
    <StaticRouter location={url}>
      <ThemeProvider>
        <AuthProvider>
          <App ssrUrl={url} />
        </AuthProvider>
      </ThemeProvider>
    </StaticRouter>
  )

  // Return per-page head tags so the server can inject the right title/meta.
  const headMeta = getHeadForUrl(url)

  return { html, head: headMeta }
}

/**
 * Returns page-specific <head> HTML for the given SSR URL.
 * These are injected into the template by the Express server.
 */
function getHeadForUrl(url) {
  if (url === '/') {
    return `
    <title>ClipRank — AI Video Clip Maker | Turn Long Videos into Viral Shorts</title>
    <meta name="description" content="ClipRank is an AI-powered video repurposing app that transcribes, ranks, and clips the best moments from your YouTube, Instagram, and TikTok videos automatically. Get viral short-form clips in minutes." />
    <meta property="og:title" content="ClipRank — AI Video Clip Maker" />
    <meta property="og:description" content="Paste a video link. Get the best moments as short vertical clips — automatically." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://cliprank.app/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="ClipRank — AI Video Clip Maker" />
    <meta name="twitter:description" content="Paste a video link. Get the best moments as short vertical clips — automatically." />
    <link rel="canonical" href="https://cliprank.app/" />
    `.trim()
  }

  if (url === '/privacy-policy') {
    return `
    <title>Privacy Policy — ClipRank</title>
    <meta name="description" content="Read ClipRank's privacy policy. Learn how we collect, use, and protect your data when you use our AI-powered video clip generation service." />
    <meta property="og:title" content="Privacy Policy — ClipRank" />
    <meta property="og:description" content="How ClipRank handles your data and privacy." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://cliprank.app/privacy-policy" />
    <link rel="canonical" href="https://cliprank.app/privacy-policy" />
    `.trim()
  }

  return ''
}
