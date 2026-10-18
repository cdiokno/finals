<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { faculty, programs } from '../data/college'
import FacultyGrid from '../components/FacultyGrid.vue'
import Icon from '../components/Icon.vue'
const route = useRoute(),
  router = useRouter()
const query = ref('')
const filters = [
  { id: 'all', code: 'Everyone' },
  ...programs,
  { id: 'staff', code: 'Leadership & staff' },
]
const active = computed({
  get: () =>
    filters.some((filter) => filter.id === route.query.faculty) ? route.query.faculty : 'all',
  set: (value) =>
    router.replace({
      path: '/',
      hash: route.hash,
      query: { ...route.query, faculty: value === 'all' ? undefined : value },
    }),
})
const filtered = computed(() =>
  faculty.filter(
    (p) =>
      (active.value === 'all' ||
        (active.value === 'staff' ? !p.programs.length : p.programs.includes(active.value))) &&
      `${p.name} ${p.role}`.toLowerCase().includes(query.value.toLowerCase().trim()),
  ),
)
const groups = computed(() =>
  active.value === 'all'
    ? [
        { id: 'staff', label: 'College leadership & staff' },
        ...programs.map((p) => ({ id: p.id, label: p.name })),
      ]
        .map((g) => ({
          ...g,
          people: filtered.value.filter((p) =>
            g.id === 'staff' ? !p.programs.length : p.programs.includes(g.id),
          ),
        }))
        .filter((g) => g.people.length)
    : [{ id: active.value, label: '', people: filtered.value }],
)
function resetFilters() {
  query.value = ''
  active.value = 'all'
}
</script>
<template>
  <section class="page-intro container">
    <h2 class="section-title">Good people.<br />Great possibilities.</h2>
    <p>
      Meet the educators, mentors, and staff who make the College of Computer Studies a place to
      grow.
    </p>
  </section>
  <section class="container section-bottom">
    <div class="directory-controls">
      <div class="filter-row" aria-label="Filter faculty by program">
        <button
          v-for="filter in filters"
          :key="filter.id"
          class="filter-chip"
          :class="{ active: active === filter.id }"
          :aria-pressed="active === filter.id"
          @click="active = filter.id"
        >
          {{ filter.code }}
        </button>
      </div>
      <label class="search-field"
        ><Icon name="search" :size="19" /><input
          v-model="query"
          type="search"
          placeholder="Find a name or role"
          aria-label="Search faculty by name or role"
      /></label>
    </div>
    <p class="results-count" role="status">
      {{ filtered.length }} {{ filtered.length === 1 ? 'person' : 'people' }} found
    </p>
    <div v-if="filtered.length">
      <section v-for="group in groups" :key="group.id" class="faculty-group">
        <h3 v-if="group.label">{{ group.label }}</h3>
        <FacultyGrid :people="group.people" />
      </section>
    </div>
    <div v-else class="empty-state">
      <Icon name="search" :size="32" />
      <h2>No matches just yet.</h2>
      <p>Try a different name or explore everyone in the college.</p>
      <button class="button button-navy" @click="resetFilters">Reset filters</button>
    </div>
    <p class="source-note">
      Names and roles follow the supplied CCS organizational chart. Faculty with more than one
      program appear in each relevant group.
      <RouterLink to="/credits">About our sources</RouterLink>
    </p>
  </section>
</template>
