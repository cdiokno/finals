<script setup>
import Icon from './Icon.vue'
import { imagePath } from '../data/college'
defineProps({ story: Object })
</script>
<template>
  <details :id="`story-${story.slug}`" class="news-card inline-story">
    <summary class="news-summary">
      <div class="news-image">
        <img :src="imagePath(story.image)" :alt="story.alt" loading="lazy" /><span>{{
          story.category
        }}</span
        ><span class="news-arrow"><Icon name="plus" /></span>
      </div>
      <div class="news-copy">
        <time :datetime="story.isoDate">{{ story.date }}</time>
        <h3>{{ story.title }}</h3>
        <p>{{ story.excerpt }}</p>
        <span class="story-read-label">Read the story <Icon name="chevron" :size="15" /></span>
      </div>
    </summary>
    <div class="inline-story-body">
      <p v-for="paragraph in story.body" :key="paragraph">{{ paragraph }}</p>
      <a :href="story.source" target="_blank" rel="noopener noreferrer" class="text-link"
        >Original announcement <Icon name="external" :size="15"
      /></a>
    </div>
  </details>
</template>
