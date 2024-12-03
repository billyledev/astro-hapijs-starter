<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { authClient } from '@lib/auth-client';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  interface SigninData {
    email: string;
    password: string;
  }

  interface ErrorsData {
    email: boolean;
    password: boolean;
  }

  const sending = ref(false);

  const initialValues: SigninData = {
    email: '',
    password: '',
  };

  const initialErrorValues: ErrorsData = {
    email: false,
    password: false,
  };

  const formData = reactive<SigninData>({ ...initialValues });
  const errors = reactive<ErrorsData>({ ...initialErrorValues });

  watch(formData, async () => {
    clearErrors();
  });

  const hasError = () => {
    return Object.values(errors).some(error => error);
  };

  const sendForm = async (e: Event) => {
    e.preventDefault();

    if (!formData.email || formData.email === '') errors.email = true;
    if (formData.email && !EMAIL_REGEX.test(formData.email)) errors.email = true;
    if (!formData.password || formData.password === '') errors.password = true;

    if (hasError()) return;

    sending.value = true;

    await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    }, {
      onRequest: () => {
        //show loading
      }, 
      onSuccess: () => {
        console.log('Successfully signed in!');
        sending.value = false;
      }, 
      onError: (ctx) => { 
        console.error(ctx.error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: ctx.error.message,
          life: 3000,
        });
        sending.value = false;
      },
    });
  };

  const clearForm = () => {
    Object.assign(formData, initialValues);
  };

  const clearErrors = () => {
    Object.assign(errors, initialErrorValues);
  }
</script>

<template>
  <Card class="mx-auto" fluid>
    <template #content>
      <FloatLabel class="mt-8">
        <InputText id="email" type="email" v-model="formData.email" :invalid="errors.email" fluid/>
        <label for="email">Email address</label>
      </FloatLabel>

      <FloatLabel class="mt-8">
        <Password id="password" v-model="formData.password" :invalid="errors.password" :feedback="false" toggleMask fluid/>
        <label for="password">Password</label>
      </FloatLabel>

      <div class="text-center mt-8">
        <Button type="submit" @click="sendForm" label="Send" :disabled="hasError() || sending"/>
      </div>

      <div class="text-center my-4">
        <a href="/signup" class="silent underline">Create an account</a>
      </div>
    </template>
  </Card>
</template>
