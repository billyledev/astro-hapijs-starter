<script lang="ts" setup>
  import { ref } from 'vue';
  import { authClient } from '@lib/auth-client';
  import { navigate } from 'astro:transitions/client';

  const loading = ref<boolean>(true);

  authClient.getSession().then((session) => {
    console.log(session.data);
    if (session.data == null) {
      navigate('/signin');
    } else {
      loading.value = false;
    }
  });
</script>

<template>
  <div v-if="!loading">
    <main class="mt-2 flex w-full">
      <div class="w-1/5 fixed top-[4em] h-[calc(100vh-4em)] overflow-y-scroll overflow-x-scroll bg-white dark:bg-zinc-900 border-r border-black/10 dark:border-white/20">
        <div class="py-2 overflow-x-scroll">
          <AppTreeView/>
        </div>
      </div>
      <div class="w-1/5"></div>
      <div class="w-4/5 h-full text-justify py-16">
        <div class="w-full mx-auto px-4 lg:px-16 space-y-8">
          <AppContentView/>
        </div>
      </div>
    </main>
  </div>
  <div v-else>
    <ProgressSpinner/>
  </div>
</template>
