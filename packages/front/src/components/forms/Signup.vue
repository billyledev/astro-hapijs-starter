<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { authClient } from '@lib/auth-client';
  import { useToast } from 'primevue/usetoast';
  await import('altcha');

  const toast = useToast();

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  interface SignupData {
    name: string;
    email: string;
    password: string;
    accepted: boolean;
  }

  interface ErrorsData {
    name: boolean;
    email: boolean;
    password: boolean;
  }

  const sending = ref(false);
  const verified = ref(false);

  const initialValues: SignupData = {
    name: '',
    email: '',
    password: '',
    accepted: false,
  };

  const initialErrorValues: ErrorsData = {
    name: false,
    email: false,
    password: false,
  };

  const formData = reactive<SignupData>({ ...initialValues });
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

  const sendForm = async (e: Event) => {
    e.preventDefault();

    if (!formData.name || formData.name === '' || formData.name.length < 2 || formData.name.length > 50) errors.name = true;
    if (!formData.email || formData.email === '') errors.email = true;
    if (formData.email && !EMAIL_REGEX.test(formData.email)) errors.email = true;
    if (!formData.password || formData.password === '') errors.password = true;

    if (hasError()) return;

    sending.value = true;

    await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      callbackURL: '/app',
    }, {
      onSuccess: () => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully signed up, please verify your email address!',
          life: 3000,
        });
        sending.value = false;
        clearForm();
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
      <form>
        <FloatLabel>
          <InputText id="name" type="text" v-model="formData.name" :invalid="errors.name" fluid/>
          <label for="name">Name</label>
        </FloatLabel>
  
        <FloatLabel class="mt-8">
          <InputText id="email" type="email" v-model="formData.email" :invalid="errors.email" fluid/>
          <label for="email">Email address</label>
        </FloatLabel>
  
        <FloatLabel class="mt-8">
          <Password inputId="password" v-model="formData.password" :invalid="errors.password" toggleMask fluid/>
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
  
        <div class="flex items-start mt-4 mb-8 justify-center">
          <div class="flex items-center h-5 self-center">
            <Checkbox id="accepted" v-model="formData.accepted" binary/>
          </div>
          <label for="accepted" class="ml-2 text-left">
            I've read and I agrees to the <a href="/terms" class="link">Terms and Conditions</a>.
          </label>
        </div>
  
        <div class="text-center mt-4">
          <Button type="submit" @click="sendForm" label="Send" :disabled="!formData.accepted || !verified || hasError() || sending"/>
        </div>
  
        <div class="text-center my-4">
          <a href="/signin" class="silent underline">I've already got an account</a>
        </div>
      </form>
    </template>
  </Card>
</template>
