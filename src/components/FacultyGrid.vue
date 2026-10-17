<script setup>
import { computed, nextTick, ref, useId } from 'vue'
import ChromaGrid from './vue-bits/ChromaGrid.vue'
import Icon from './Icon.vue'
import { imagePath, programs } from '../data/college'
const props = defineProps({ people: { type: Array, default: () => [] } })
const profileTitleId = useId()
const selected = ref(null)
const dialog = ref(null)
const initials = (name) =>
  name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
const items = computed(() =>
  props.people.map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: p.role,
    image: p.photo ? imagePath(p.photo) : '',
    initials: initials(p.name),
    handle: p.programs.length ? p.programs.map((s) => s.toUpperCase()).join(' / ') : p.group,
    borderColor: '#858fd8',
  })),
)
async function showProfile(index) {
  selected.value = props.people[index]
  await nextTick()
  dialog.value.showModal()
}
</script>
<template>
  <ChromaGrid :items="items" :radius="360" @select="showProfile" />
  <dialog
    ref="dialog"
    class="profile-dialog"
    :aria-labelledby="profileTitleId"
    @click="
      (event) => {
        if (event.target === dialog) dialog.close()
      }
    "
  >
    <template v-if="selected"
      ><button class="icon-button dialog-close" aria-label="Close profile" @click="dialog.close()">
        <Icon name="close" /></button
      ><img
        v-if="selected.photo"
        :src="imagePath(selected.photo)"
        :alt="selected.name"
        class="profile-image" />
      <div v-else class="profile-placeholder">{{ initials(selected.name) }}</div>
      <div class="profile-content">
        <span class="section-kicker">The people of CCS</span>
        <h2 :id="profileTitleId">{{ selected.name }}</h2>
        <p class="profile-credentials">{{ selected.credentials }}</p>
        <p>{{ selected.role }}</p>
        <div class="profile-programs">
          <RouterLink
            v-for="id in selected.programs"
            :key="id"
            :to="`/programs/${id}`"
            class="filter-chip"
            @click="dialog.close()"
            >{{ programs.find((p) => p.id === id).code }} <Icon name="arrow-up-right" :size="15"
          /></RouterLink>
        </div>
        <p class="source-note">
          Role and program association are based on the supplied college organizational chart.
        </p>
        <RouterLink to="/contact" class="button button-navy" @click="dialog.close()"
          >Contact the college <Icon name="arrow-up-right" :size="17"
        /></RouterLink></div
    ></template>
  </dialog>
</template>
