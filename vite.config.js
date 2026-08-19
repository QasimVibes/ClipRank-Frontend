import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    // Tell Vite to use the 'node' export condition when bundling SSR code.
    // This is needed for react-router-dom v7 which exports different bundles
    // depending on the environment condition.
    ssr: {
      resolve: {
        conditions: ['node', 'module', 'import', 'default'],
      },
    },
  }
})
