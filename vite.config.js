import { defineConfig, loadEnv } from 'vite'
import { readFileSync } from 'node:fs'

function projectEnv() {
  try {
    const contents = readFileSync('/vercel/share/.env.project', 'utf8')
    return Object.fromEntries(
      contents.split(/\r?\n/).flatMap((line) => {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
        return match ? [[match[1], match[2].replace(/^['"]|['"]$/g, '')]] : []
      }),
    )
  } catch {
    return {}
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...projectEnv(), ...loadEnv(mode, process.cwd(), ''), ...process.env }

  const config = {
    url: env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '',
    key: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || '',
  }

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'SUPABASE_'],
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html
        .replaceAll('%NEXT_PUBLIC_SUPABASE_URL%', config.url)
        .replaceAll('%NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY%', config.key)
        .replace(
          '<head>',
          `<head><script>window.__SUPABASE_CONFIG__=${JSON.stringify(config)}</script>`,
        ),
    },
  }
})
  
