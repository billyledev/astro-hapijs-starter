<script lang="ts" setup>
  interface QNA {
    question: string;
    answer: string;
  }

  const qnas: QNA[] = [
    {
      question: 'Why use Astro Vue Auth Template?',
      answer: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Aliquam duis porta semper sed gravida montes eu. Aliquam potenti aenean lacinia bibendum tempor tempus. Augue senectus imperdiet mattis maecenas efficitur dictum. Amet libero duis lacinia ut habitant quisque lorem sed. Vitae mauris facilisis congue conubia vulputate sed.',
    },
    {
      question: 'Can I get a free trial?',
      answer: 'Facilisi auctor nunc dictum facilisis proin sagittis sapien. Nisi sagittis dapibus sem sagittis id nunc egestas. Auctor quisque praesent tristique elit primis torquent donec. Fusce mauris mauris, felis mi adipiscing semper. Aliquam sodales porta, dis ullamcorper habitasse lobortis porttitor tellus taciti. Vivamus elementum integer maecenas; gravida est montes urna. Pellentesque tempor nostra mattis dis dolor congue varius.',
    },
    {
      question: 'How does it works?',
      answer: 'Tempor turpis penatibus dolor donec a ullamcorper at commodo. Molestie netus ipsum dictumst enim sit pellentesque donec ullamcorper. Sit sed quisque quam donec venenatis. Interdum aenean mattis, pellentesque dis egestas varius pretium risus. Magna feugiat dictum imperdiet rhoncus nibh magna in. Ad ante nullam sapien varius bibendum nam. Aenean velit posuere amet mattis nec finibus nunc.',
    },
    {
      question: 'Where to start?',
      answer: 'Ridiculus hendrerit integer ultrices ac odio tristique. Nulla laoreet per integer, mi leo aliquet. Felis in arcu ullamcorper fermentum nulla euismod pharetra vestibulum. Venenatis enim hendrerit maecenas aptent maximus montes ipsum. Curabitur dapibus congue nullam montes interdum sem mi odio. Imperdiet luctus amet mollis congue aptent phasellus dictumst. Blandit vitae quam ultricies id vel urna.',
    },
  ];
</script>

<template>
  <div class="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 xl:gap-x-32 text-left">
    <div v-for="qna of qnas">
      <h3 class="flex items-center gap-2"><i class="pi pi-chevron-right text-primary"></i>{{ qna.question }}</h3>
      <p class="pl-6 pt-2 text-primary font-light" severity="secondary" variant="simple" v-html="qna.answer"></p>
    </div>
  </div>
</template>
