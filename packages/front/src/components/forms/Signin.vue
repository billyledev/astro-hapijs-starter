<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  await import('altcha');

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
  const verified = ref(false);

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

  onMounted(() => {
    const widget = document.querySelector('altcha-widget');

    widget?.addEventListener('statechange', (e) => {
      const { detail } = e as AltchaStateChangeEvent;
      if (detail.state === 'verified') {
        verified.value = true;
      } else {
        verified.value = false;
      }
    })
  });

  watch(formData, async () => {
    clearErrors();
  });

  const hasError = () => {
    return Object.values(errors).some(error => error);
  };

  const sendForm = (e: Event) => {
    e.preventDefault();

    if (!formData.email || formData.email === '') errors.email = true;
    if (formData.email && !EMAIL_REGEX.test(formData.email)) errors.email = true;
    if (!formData.password || formData.password === '') errors.password = true;

    if (hasError()) return;

    sending.value = true;
  };

  const resetCaptcha = () => {
    (document.querySelector('altcha-widget') as any).reset();
  };

  const clearForm = () => {
    Object.assign(formData, initialValues);
    resetCaptcha();
  };

  const clearErrors = () => {
    Object.assign(errors, initialErrorValues);
  }
</script>

<template>
  <Card class="pt-4 mx-auto" fluid>
    <template #content>
      <FloatLabel class="mt-8">
        <InputText id="email" type="email" v-model="formData.email" :invalid="errors.email" fluid/>
        <label for="email">Email address</label>
      </FloatLabel>

      <FloatLabel class="mt-8">
        <Password id="password" v-model="formData.password" :invalid="errors.password" :feedback="false" toggleMask fluid/>
        <label for="password">Password</label>
      </FloatLabel>

      <div class="my-8 grid">
        <altcha-widget
          hideFooter
          hideLogo
          test
          challengeurl="/api/challenge"
          class="mx-auto accent-main"
        ></altcha-widget>
      </div>

      <div class="text-center mt-4">
        <Button type="submit" @click="sendForm" label="Send" :disabled="!verified || hasError() || sending"/>
      </div>

      <div class="text-center my-4">
        <a href="/signup" class="silent underline">Create an account</a>
      </div>
    </template>
  </Card>
</template>
