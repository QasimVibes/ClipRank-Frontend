import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

// Routes that get server-side rendered for SEO.
const SSR_ROUTES = ['/', '/privacy-policy']

async function createServer() {
  const app = express()

  /** @type {import('vite').ViteDevServer | undefined} */
  let vite

  if (!isProduction) {
    // Development: use Vite's dev middleware with SSR mode.
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  } else {
    // Production: serve pre-built static assets.
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use('/', sirv(path.resolve(__dirname, 'dist/client'), { extensions: [] }))
  }

  // Express 4 uses '*', Express 5 uses '*splat'
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    // Only SSR the designated public pages.
    const shouldSSR = SSR_ROUTES.includes(url)

    try {
      let template
      let render

      if (!isProduction) {
        // Load and transform index.html via Vite (handles HMR injection etc.)
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)

        // Dynamically load the server entry through Vite's module graph.
        render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render
      }

      let html

      if (shouldSSR) {
        // Server-render the page and inject the HTML + per-page head tags.
        const { html: appHtml, head: headHtml } = render(url)

        // Inject page-specific head tags before </head>.
        const templateWithHead = headHtml
          ? template.replace('</head>', `${headHtml}\n  </head>`)
          : template

        // Inject the rendered app HTML.
        html = templateWithHead.replace('<!--app-html-->', appHtml)
      } else {
        // Non-SSR routes: serve the bare SPA shell — React takes over client-side.
        html = template
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err) {
      // Let Vite fix the stack trace in development.
      if (vite) vite.ssrFixStacktrace(err)
      console.error(err)
      next(err)
    }
  })

  return app
}

createServer().then((app) => {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`ClipRank SSR server running at http://localhost:${port}`)
    console.log(`SSR-enabled routes: ${SSR_ROUTES.join(', ')}`)
  })
})
