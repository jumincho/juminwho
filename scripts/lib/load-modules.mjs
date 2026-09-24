import { createServer } from 'vite'

/**
 * Loads the site's own TypeScript modules (content, components) the way the
 * app sees them, through a short-lived Vite server in SSR mode.
 *
 *   const [content] = await loadModules(['/src/data/profile.ts'])
 */
export async function loadModules(ids) {
  const vite = await createServer({
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: 'error',
  })
  try {
    return await Promise.all(ids.map((id) => vite.ssrLoadModule(id)))
  } finally {
    await vite.close()
  }
}
