<script setup>
import Icon from '../components/Icon.vue'
import { imagePath } from '../data/college'
const milestones = [
  {
    year: '1995',
    title: 'An idea takes root.',
    text: 'The BS Computer Science program begins in the College of Commerce with about 100 students.',
  },
  {
    year: '2003',
    title: 'A college of our own.',
    text: 'Computing programs come together as the College of Computer Studies, based in Mary Thomas Hall.',
  },
  {
    year: '2014',
    title: 'A new creative dimension.',
    text: 'Digital Media and Interactive Arts joins the college’s academic offerings.',
  },
  {
    year: '2018',
    title: 'A broader world of knowledge.',
    text: 'Library and Information Science becomes part of the CCS community.',
  },
]
</script>
<template>
  <section class="container about-hero">
    <div>
      <span class="section-kicker"><span></span> This is CCS</span>
      <h2 class="section-title">Different people.<br />One shared possibility.</h2>
      <p>
        At Central Philippine University, we bring technology, creativity, and Christian values
        together. Our story is still being written—and there’s room for yours.
      </p>
      <RouterLink to="/programs" class="button button-navy"
        >Find your place <Icon name="arrow-up-right"
      /></RouterLink>
    </div>
    <figure class="about-campus">
      <img
        :src="imagePath('campus.jpg')"
        alt="Mary Thomas Hall, home of the College of Computer Studies"
      />
      <figcaption>
        <Icon name="pin" :size="16" /> Mary Thomas Hall · Central Philippine University
      </figcaption>
    </figure>
  </section>
  <section class="purpose-section">
    <div class="container section">
      <span class="section-kicker">Rooted in science and faith</span>
      <h2>A clear purpose.<br />An open future.</h2>
      <div class="purpose-grid">
        <article>
          <Icon name="sparkles" :size="34" />
          <h3>Our vision</h3>
          <p>
            Academic excellence in information technology education that responds to the whole
            person and the needs of the world.
          </p>
        </article>
        <article>
          <Icon name="graduation" :size="34" />
          <h3>Our mission</h3>
          <p>
            Educating students through Christian principles and computing practice, preparing them
            for further study, software development, computing systems, information management, and
            lifelong learning.
          </p>
        </article>
        <article>
          <Icon name="check" :size="34" />
          <h3>Our commitment</h3>
          <p>
            Bring Christian values, professionalism, and academic excellence into our work, while
            continually improving the quality of our service to the community.
          </p>
        </article>
      </div>
      <p class="source-note">
        Summarized from the college’s published
        <a
          href="https://ccs.cpu.edu.ph/vision-and-mission/"
          target="_blank"
          rel="noopener noreferrer"
          >vision, mission, and quality policy <Icon name="external" :size="13" /></a
        >.
      </p>
    </div>
  </section>
  <section class="container section history-section">
    <div>
      <span class="section-kicker">The story so far</span>
      <h2>Small beginnings.<br />Lasting possibilities.</h2>
      <p>From one computing program to a community across four disciplines.</p>
      <a
        href="https://ccs.cpu.edu.ph/history/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
        >Read the college history <Icon name="external" :size="16"
      /></a>
    </div>
    <div class="timeline">
      <article v-for="m in milestones" :key="m.year">
        <span>{{ m.year }}</span>
        <div>
          <h3>{{ m.title }}</h3>
          <p>{{ m.text }}</p>
        </div>
      </article>
    </div>
  </section>
  <section class="container section-bottom">
    <div class="dean-panel">
      <img
        :src="imagePath('quijano-e1637132499305.webp')"
        alt="Ma. Christina A. Quijano, Dean"
        loading="lazy"
      />
      <div>
        <span class="section-kicker">Meet the college</span>
        <h2>People make<br />the difference.</h2>
        <p>
          Get to know our dean, department heads, faculty, and the staff supporting the CCS
          community.
        </p>
        <p>
          <strong>Ma. Christina A. Quijano, MSCS</strong><br />Dean, College of Computer Studies
        </p>
        <RouterLink to="/faculty" class="button button-navy"
          >Meet our faculty & staff <Icon name="arrow-up-right"
        /></RouterLink>
      </div>
    </div>
  </section>
</template>
