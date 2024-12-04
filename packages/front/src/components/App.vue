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
    <h1>Hello, World!</h1>
  </div>
  <div v-else>
    <ProgressSpinner/>
  </div>
</template>
