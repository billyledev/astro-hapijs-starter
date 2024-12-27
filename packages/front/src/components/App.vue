<script lang="ts" setup>
  import { ref } from 'vue';
  import { authClient } from '@lib/auth-client';
  import { navigate } from 'astro:transitions/client';

  type User = typeof authClient.$Infer.Session.user;

  const loading = ref<boolean>(true);
  const userData = ref<User>();

  authClient.getSession().then((session) => {
    if (session.data == null) {
      navigate('/signin');
    } else {
      loading.value = false;
      userData.value = session.data.user;
    }
  });

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate('/');
        },
      },
    });
  };
</script>

<template>
  <div v-if="!loading">
    <main class="mt-2 flex">
      <div class="w-full min-h-[calc(100vh-40vh)] sm:min-h-[calc(100vh-33vh)]">
        <div class="w-full text-center">
          <h3 class="py-16">Welcome {{ userData?.name }}!</h3>
          <Button label="Sign Out" @click="signOut"/>
        </div>
      </div>
    </main>
  </div>
  <div v-else>
    <ProgressSpinner/>
  </div>
</template>
