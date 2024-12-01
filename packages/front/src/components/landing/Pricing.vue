<script lang="ts" setup>
  import { ref, defineComponent, h, type Component } from 'vue';

  import Button from 'primevue/button';

  const ChooseButton = defineComponent({
    name: 'ChooseButton',
    setup() {
      return () => h('div', [
        h('a', {
          href: '/signup',
        }, [
          h(Button, {
            label: 'Choose',
            severity: 'contrast',
            variant: 'outlined',
            size: 'small',
          }),
        ]),
      ]);
    },
  });

  const ContactUsButton = defineComponent({
    name: 'ContactUsButton',
    setup() {
      return () => h('span', {
          class: 'flex items-center',
        }, [
          h('i', {
            class: 'pi pi-chevron-right pr-1 font-semibold',
            style: 'font-size: 0.5rem',
          }),
          h('a', {
            href: '/contact',
            class: 'silent underline',
          }, ['Contact us']),
        ]
      );
    },
  });

  interface Price {
    level: string;
    monthly?: string;
    annual?: string;
    annualDiscount?: string;
    customPricing?: boolean;
    customPrice?: string;
    customText?: string;
    features: string[];
    cta: Component;
  }

  const showAnnualPricing = ref(true);
  const prices: Price[] = [
    {
      level: 'Free',
      customPricing: true,
      customPrice: '0€',
      customText: 'Free for everyone',
      features: [
        'Free feature 1',
        'Free feature 2',
      ],
      cta: ChooseButton,
    },
    {
      level: 'Freelance',
      monthly: '20€/month',
      annual: '16€/month',
      annualDiscount: '-20%',
      features: [
        'All the Free features and...',
        'Freelance feature 1',
        'Freelance feature 2',
      ],
      cta: ChooseButton,
    },
    {
      level: 'Startup',
      monthly: '25€/month/user',
      annual: '20€/month/user',
      annualDiscount: '-20%',
      features: [
        'All the Freelance features and...',
        'Startup feature 1',
        'Startup feature 2',
        'Startup feature 3',
      ],
      cta: ChooseButton,
    },
    {
      level: 'Enterprise',
      customPricing: true,
      customPrice: 'Custom pricing',
      customText: 'Annual billing',
      features: [
        'All the Startup features and...',
        'Enterprise feature 1',
        'Enterprise feature 2',
        'Enterprise feature 3',
        'Enterprise feature 4',
      ],
      cta: ContactUsButton,
    },
  ];

  const cardOptions = {
    body: {
      class: 'h-full',
    },
    content: {
      class: 'h-full',
    },
  };
</script>

<template>
  <div class="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    <Card v-for="price of prices" :pt="cardOptions">
      <template #title>
        <div class="text-left">{{ price.level }}</div>
      </template>
      <template #subtitle>
        <div class="flex text-left gap-2 items-center">
          {{ price.customPricing ? price.customPrice : showAnnualPricing ? price.annual : price.monthly }}
          <Badge v-if="showAnnualPricing && !price.customPricing" :value="price.annualDiscount"/>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col h-full pt-4 text-left">
          <div class="flex text-sm gap-2">
            <div v-if="!price.customPricing" class="flex items-center gap-2">
              <ToggleSwitch v-model="showAnnualPricing"/> Annual billing
            </div>
            <div v-else class="py-0.5">
              {{ price.customText }}
            </div>
          </div>
          <Divider/>
          <div class="px-2">
            <ul class="list-checkmark marker:text-xs text-sm">
              <li v-for="feature of price.features">{{ feature }}</li>
            </ul>
          </div>
          <div class="grow"></div>
          <component class="flex pt-8" :is="price.cta"/>
        </div>
      </template>
    </Card>
  </div>
</template>
