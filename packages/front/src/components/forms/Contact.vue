<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useToast } from 'primevue/usetoast';
  await import('altcha');

  const toast = useToast();
  type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined;

  const STATUS_OK = 200;
  const STATUS_BAD_REQUEST = 400;

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  interface Subject {
    name: string;
    value: string;
  }

  interface ContactData {
    name: string;
    email: string;
    subject: Subject | {};
    message: string;
    accepted: boolean;
  }

  interface ErrorsData {
    name: boolean;
    email: boolean;
    subject: boolean;
    message: boolean;
  }

  const sending = ref(false);
  const verified = ref(false);

  const subjects: Subject[] = [
    {
      name: 'Informations request',
      value: 'infos',
    },
    {
      name: 'Enterprise pricing',
      value: 'enterprise',
    },
    {
      name: 'Software bug',
      value: 'issue',
    },
    {
      name: 'Other',
      value: 'other',
    },
  ];

  const initialValues: ContactData = {
    name: '',
    email: '',
    subject: {},
    message: '',
    accepted: false,
  };

  const initialErrorValues: ErrorsData = {
    name: false,
    email: false,
    subject: false,
    message: false,
  };

  const formData = reactive<ContactData>({ ...initialValues });
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

  const addToast = (severity: ToastSeverity, summary: string, detail: string) => {
    toast.add({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  const addSuccessToast = (summary: string, content: string) => {
    addToast('success', summary, content);
  };

  const addErrorToast = (summary: string, content: string) => {
    addToast('error', summary, content);
  };

  const getSubject = () => {
    return formData.subject ? (formData.subject as Subject).value : '';
  };

  const sendForm = (e: Event) => {
    e.preventDefault();

    if (!formData.name || formData.name === '' || formData.name.length < 2 || formData.name.length > 50) errors.name = true;
    if (!formData.email || formData.email === '') errors.email = true;
    if (formData.email && !EMAIL_REGEX.test(formData.email)) errors.email = true;
    if (!formData.subject || Object.keys(formData.subject).length === 0) errors.subject = true;
    if (formData.subject && !subjects.map((subject) => subject.value).includes((formData.subject as Subject).value)) errors.subject = true;
    if (!formData.message || formData.message.length < 10 || formData.message.length > 250) errors.message = true;

    if (hasError()) return;

    sending.value = true;

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: getSubject(),
        message: formData.message,
        validation: (document.querySelector('input[name="altcha"]') as HTMLInputElement).value,
      }),
    }).then(async (response) => {
      if (response.status === STATUS_OK) {
        addSuccessToast('Success', 'Your message was successfully sent.');
        clearForm();
      } else if (response.status === STATUS_BAD_REQUEST) {
        addErrorToast('Error', 'Invalid captcha.');
        resetCaptcha();
      } else {
        addErrorToast('Error', 'Unknown error, please try again later.');
      }
    }).catch(() => {
      addErrorToast('Error', 'Unknown error, please try again later.');
    }).finally(() => {
      sending.value = false;
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
  };
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
        
        <FloatLabel class="mt-8 w-full md:w-1/2">
          <Select v-model="formData.subject" :invalid="errors.subject" inputId="subject" :options="subjects" optionLabel="name" class="text-left" fluid/>
          <label for="subject">Subject</label>
        </FloatLabel>
  
        <FloatLabel class="mt-8">
          <Textarea id="message" v-model="formData.message" :invalid="errors.message" rows="5" cols="30" fluid/>
          <label for="message">Message</label>
        </FloatLabel>
  
        <div class="mt-8 grid">
          <altcha-widget
            hideFooter
            hideLogo
            challengeurl="/api/captcha/challenge"
            class="mx-auto accent-main"
          ></altcha-widget>
        </div>
  
        <div class="flex items-start mt-4 mb-8 justify-center">
          <div class="flex items-center h-5 self-center">
            <Checkbox id="accepted" v-model="formData.accepted" binary/>
          </div>
          <label for="accepted" class="ml-2">I've read and agrees to the <a href="/terms" class="link">Terms and Conditions</a>.</label>
        </div>
  
        <div class="text-center mt-4">
          <Button type="submit" @click="sendForm" label="Send" :disabled="!formData.accepted || !verified || hasError() || sending"/>
        </div>
      </form>
    </template>
  </Card>
</template>
