// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  output: 'static',
  integrations: [
    icon({
      include: {
        ri: [
          'sun-line',
          'moon-line',
          'github-fill',
          'twitter-x-line',
        ],
      },
    }),
    vue({
      appEntrypoint: 'src/_app',
      template: {
        compilerOptions: {
          isCustomElement: (tag) => [
            'altcha-widget',
          ].includes(tag),
        },
      },
    }),
    tailwind(),
  ],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
    },
    plugins: [
      Components({
        resolvers: [
          PrimeVueResolver(),
        ],
      }),
    ],
  },
});
