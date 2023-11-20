import { resolve } from 'path'
import { vitePreprocess } from '@sveltejs/kit/vite'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    alias: {
      $components: resolve('./src/components'),
      $static: resolve('./static'),
      $stores: resolve('./src/stores.ts')
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html'
    })
  }
}

export default config
