import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const config = {
    url: env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '',
    key: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || '',
  }

  return {
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(
        '<head>',
        `<head><script>window.__SUPABASE_CONFIG__=${JSON.stringify(config)}</script>`,
      ),
    },
  }
})
  
