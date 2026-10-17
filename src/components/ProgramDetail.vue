<script setup>
import { computed } from 'vue'
import { programs, faculty, imagePath } from '../data/college'
import Icon from './Icon.vue'
const props = defineProps({ id: String })
const program = computed(() => programs.find((p) => p.id === props.id))
const teachers = computed(() => faculty.filter((p) => p.programs.includes(props.id)))
</script>
<template>
  <div class="inline-program-content">
    <div class="inline-program-intro" :class="program.theme">
      <div>
        <span class="section-kicker">{{ program.degree }}</span>
        <h4>{{ program.tagline }}</h4>
        <p>{{ program.overview }}</p>
      </div>
      <img
        :src="imagePath(program.logo)"
        :alt="program.org"
        width="84"
        height="84"
        loading="lazy"
      />
    </div>
    <div class="inline-program-columns">
      <section>
        <h4>What you’ll work toward</h4>
        <ul class="inline-objectives">
          <li v-for="objective in program.objectives" :key="objective">
            <Icon name="check" :size="17" /><span>{{ objective }}</span>
          </li>
        </ul>
      </section>
      <section>
        <h4>What you’ll learn</h4>
        <ul class="inline-subjects">
          <li v-for="subject in program.subjects" :key="subject">{{ subject }}</li>
        </ul>
      </section>
      <section>
        <h4>Where it could take you</h4>
        <ul class="inline-careers">
          <li v-for="career in program.careers" :key="career">
            <Icon name="arrow-up-right" :size="15" />{{ career }}
          </li>
        </ul>
      </section>
    </div>
    <div class="inline-program-teachers">
      <div>
        <span class="section-kicker">People behind the possibilities</span>
        <h4>Your teachers</h4>
      </div>
      <div class="inline-teacher-list">
        <RouterLink
          v-for="teacher in teachers"
          :key="teacher.id"
          :to="{ path: '/faculty', query: { program: program.id } }"
          ><img
            v-if="teacher.photo"
            :src="imagePath(teacher.photo)"
            alt=""
            width="30"
            height="30"
            loading="lazy" /><span v-else class="inline-teacher-initials">{{
            teacher.name
              .split(' ')
              .filter((word) => word.length > 2)
              .slice(0, 2)
              .map((word) => word[0])
              .join('')
          }}</span
          ><span>{{ teacher.name }}</span
          ><Icon name="arrow-up-right" :size="13"
        /></RouterLink>
      </div>
    </div>
    <div class="inline-program-footer">
      <p class="source-note">
        Study and career highlights summarize the published program focus, not a current semester
        schedule or employment guarantee.
        <a :href="program.source" target="_blank" rel="noopener noreferrer"
          >Official program details <Icon name="external" :size="12"
        /></a>
      </p>
      <RouterLink
        :to="{ path: '/contact', query: { program: program.code } }"
        class="button button-navy"
        >Ask about {{ program.code }} <Icon name="arrow-up-right" :size="17"
      /></RouterLink>
    </div>
  </div>
</template>
