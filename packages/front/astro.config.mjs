// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  output: 'static',
  integrations: [
    vue({
      appEntrypoint: 'src/_app',
    }),
    tailwind(),
  ],
  vite: {
    plugins: [
      Components({
        resolvers: [
          PrimeVueResolver(),
        ],
      }),
    ],
  },
});
