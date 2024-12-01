<script lang="ts" setup>
  interface Feature {
    icon: string;
    title: string;
    description: string;
  }

  const features: Feature[] = [
    {
      icon: 'pi-sparkles',
      title: 'Feature #1',
      description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Cubilia felis lobortis vulputate tempor bibendum magna. Commodo orci maecenas faucibus sem torquent iaculis nam. Mollis egestas ex duis feugiat felis ac at. Mattis sem hendrerit nibh sollicitudin hendrerit praesent ad. Quam efficitur leo velit imperdiet vehicula; massa curae. Pharetra iaculis est montes ipsum imperdiet platea.',
    },
    {
      icon: 'pi-sparkles',
      title: 'Feature #2',
      description: 'Semper turpis placerat viverra proin leo erat convallis. Laoreet sed natoque varius quam nibh. Nunc vehicula congue diam viverra maecenas. Dis vulputate pretium habitasse penatibus massa rutrum maximus. Ultricies tristique pretium mauris et amet semper porttitor. Aliquam diam et sed arcu sem a. Fusce vel vestibulum montes ultricies sodales.',
    },
    {
      icon: 'pi-sparkles',
      title: 'Feature #3',
      description: 'Scelerisque etiam convallis condimentum enim non cubilia lacinia. Dignissim lobortis convallis viverra euismod facilisis cubilia maximus. Per faucibus eros, ut sed donec tellus taciti taciti sit. Volutpat efficitur taciti conubia aliquam in fringilla quisque aptent. Vestibulum nostra suspendisse hendrerit ante natoque lobortis. Hendrerit rhoncus phasellus pharetra pretium bibendum. Mattis at orci euismod mus venenatis. Litora conubia congue vel molestie lacinia taciti.',
    },
    {
      icon: 'pi-sparkles',
      title: 'Feature #4',
      description: 'Nulla dictum sed vitae sapien class tortor. Natoque a semper orci; per tellus enim ante. Hac venenatis lacinia; rhoncus eleifend placerat vitae porta. Taciti urna sed facilisi morbi velit dignissim iaculis. Mauris class potenti bibendum, justo phasellus aliquam est. Sodales litora tempor congue tempor quisque rhoncus feugiat pharetra nulla. Lobortis vehicula dapibus congue nunc blandit molestie semper platea.',
    },
  ];
</script>

<template>
  <div class="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 xl:gap-x-32 text-left">
    <div v-for="feature of features">
      <h3 class="flex items-center gap-2"><i class="pi text-primary" :class="feature.icon"></i>{{ feature.title }}</h3>
      <p class="pl-6 pt-2 text-primary font-light" severity="secondary" variant="simple" v-html="feature.description"></p>
    </div>
  </div>
</template>
