<script setup>
import { inject } from 'vue'
import Icon from './Icon.vue'
import { programs, imagePath } from '../data/college'
const motionPaused = inject('motionPaused')
</script>
<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-invitation">
        <div>
          <span class="footer-small">Your next chapter starts with a hello.</span>
          <h2>Big ideas.<br />Even bigger possibilities.</h2>
        </div>
        <RouterLink to="/contact" class="footer-circle" aria-label="Connect with the college"
          ><Icon name="arrow-up-right" :size="48"
        /></RouterLink>
      </div>
      <div class="footer-columns">
        <div class="footer-brand">
          <RouterLink to="/" class="brand"
            ><img :src="imagePath('ccs-logo.png')" alt="" width="46" height="46" /><strong
              >College of<br />Computer Studies.</strong
            ></RouterLink
          >
          <p>Central Philippine University<br />Mary Thomas Hall, Jaro, Iloilo City</p>
          <a href="mailto:ccssec@cpu.edu.ph"
            >ccssec@cpu.edu.ph <Icon name="arrow-up-right" :size="15"
          /></a>
        </div>
        <div>
          <h3>Explore</h3>
          <RouterLink to="/about">About the college</RouterLink
          ><RouterLink to="/faculty">Faculty & staff</RouterLink
          ><RouterLink to="/news">News & stories</RouterLink
          ><RouterLink to="/contact">Contact us</RouterLink>
        </div>
        <div>
          <h3>Find your program</h3>
          <RouterLink v-for="p in programs" :key="p.id" :to="`/programs/${p.id}`">{{
            p.name
          }}</RouterLink>
        </div>
        <div>
          <h3>Stay connected</h3>
          <a href="https://cpu.edu.ph/" target="_blank" rel="noopener noreferrer"
            >CPU website <Icon name="external" :size="13" /></a
          ><a href="https://ccs.cpu.edu.ph/" target="_blank" rel="noopener noreferrer"
            >Official CCS website <Icon name="external" :size="13" /></a
          ><RouterLink to="/credits">Sources & credits</RouterLink>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 CPU College of Computer Studies <span>· Student redesign project</span></p>
        <button
          class="motion-toggle"
          :aria-pressed="motionPaused"
          @click="motionPaused = !motionPaused"
        >
          <Icon :name="motionPaused ? 'play' : 'pause'" :size="14" />
          {{ motionPaused ? 'Enable motion' : 'Pause motion' }}</button
        ><span>Made for curious minds <span class="yellow-star">✳</span></span>
      </div>
    </div>
  </footer>
</template>
