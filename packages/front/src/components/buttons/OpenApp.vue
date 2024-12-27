<script lang="ts" setup>
  import { navigate } from 'astro:transitions/client';
</script>

<template>
  <Button label="Open App" rounded outlined size="small" severity="contrast" @click="navigate('/app')"/>
</template>
