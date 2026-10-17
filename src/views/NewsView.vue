<script setup>
import { computed, ref } from 'vue'
import NewsCard from '../components/NewsCard.vue'
import Icon from '../components/Icon.vue'
import { stories } from '../data/college'
const category = ref('All stories'),
  query = ref('')
const categories = ['All stories', 'Community', 'Milestones', 'Alumni']
const filtered = computed(() =>
  stories.filter(
    (s) =>
      (category.value === 'All stories' || s.category === category.value) &&
      `${s.title} ${s.excerpt}`.toLowerCase().includes(query.value.toLowerCase().trim()),
  ),
)
function resetFilters() {
  query.value = ''
  category.value = 'All stories'
}
</script>
<template>
  <section class="page-intro container">
    <span class="section-kicker"><span></span> News, events & announcements</span>
    <h2 class="section-title">Stories worth<br />sharing.</h2>
    <p>
      Connections made. Milestones reached. A look at the people and moments shaping our community.
    </p>
  </section>
  <section class="container section-bottom">
    <div class="archive-notice">
      <Icon name="book" :size="20" />
      <p>
        From the CCS archive. These published stories retain their original dates.
        <a href="https://cpu.edu.ph/news/" target="_blank" rel="noopener noreferrer"
          >Visit CPU for current updates <Icon name="external" :size="14"
        /></a>
      </p>
    </div>
    <div class="directory-controls">
      <div class="filter-row" aria-label="Filter stories by category">
        <button
          v-for="c in categories"
          :key="c"
          class="filter-chip"
          :class="{ active: category === c }"
          :aria-pressed="category === c"
          @click="category = c"
        >
          {{ c }}
        </button>
      </div>
      <label class="search-field"
        ><Icon name="search" :size="19" /><input
          v-model="query"
          type="search"
          placeholder="Search stories"
          aria-label="Search stories"
      /></label>
    </div>
    <p class="results-count" role="status">
      {{ filtered.length }} {{ filtered.length === 1 ? 'story' : 'stories' }}
    </p>
    <div v-if="filtered.length" class="news-grid">
      <NewsCard v-for="story in filtered" :key="story.slug" :story="story" />
    </div>
    <div v-else class="empty-state">
      <h2>No stories found.</h2>
      <p>Try another search or browse all stories.</p>
      <button class="button button-navy" @click="resetFilters">Reset filters</button>
    </div>
    <div class="advice-panel">
      <Icon name="graduation" :size="36" />
      <div>
        <h2>Looking for upcoming activities?</h2>
        <p>Contact the college for the latest event and announcement details.</p>
      </div>
      <RouterLink to="/contact" class="button button-navy"
        >Ask the college <Icon name="arrow-up-right"
      /></RouterLink>
    </div>
  </section>
</template>
