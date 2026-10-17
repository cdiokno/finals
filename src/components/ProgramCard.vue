<script setup>
import Icon from './Icon.vue'
import ProgramArt from './ProgramArt.vue'
defineProps({ program: Object })
</script>
<template>
  <RouterLink :to="`/programs/${program.id}`" class="program-card" :class="program.theme"
    ><div class="program-card-top">
      <span>{{ program.code }}</span
      ><Icon name="arrow-up-right" :size="21" />
    </div>
    <ProgramArt :program="program" />
    <div class="program-card-copy">
      <h3>{{ program.name }}</h3>
      <p>{{ program.short }}</p>
      <span class="card-link">Explore program <Icon name="arrow-right" :size="17" /></span></div
  ></RouterLink>
</template>
