import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

import colors from 'tailwindcss/colors';

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: colors.slate,
  },
});

export default (app: App) => {
  app.use(PrimeVue, {
    theme: {
      preset: CustomPreset,
      options: {
        darkModeSelector: '.dark',
      },
    },
  });
};
