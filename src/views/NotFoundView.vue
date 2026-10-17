<script setup>
import Icon from '../components/Icon.vue'
</script>
<template>
  <section class="container not-found">
    <span class="error-number" aria-hidden="true">404<span>✳</span></span>
    <h1>A little off the path.</h1>
    <p>This page isn’t here, but your next possibility is.</p>
    <RouterLink to="/" class="button button-navy"
      >Back to home <Icon name="arrow-right"
    /></RouterLink>
  </section>
</template>
