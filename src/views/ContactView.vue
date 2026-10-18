<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import { programs, imagePath } from '../data/college'
const route = useRoute()
const form = reactive({
  name: '',
  email: '',
  topic: programs.some((p) => p.code === route.query.program) ? route.query.program : '',
  message: '',
})
watch(
  () => route.query.program,
  (code) => {
    if (programs.some((program) => program.code === code)) {
      form.topic = code
      submitted.value = false
    }
  },
)
const errors = ref({}),
  submitted = ref(false)
const emailDraft = computed(
  () =>
    `mailto:ccssec@cpu.edu.ph?subject=${encodeURIComponent(`CCS inquiry: ${form.topic}`)}&body=${encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nReply to: ${form.email}`)}`,
)
async function submit() {
  errors.value = {}
  if (form.name.trim().length < 2)
    errors.value.name = 'Please enter your name (at least 2 characters).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.value.email = 'Please enter a valid email address.'
  if (!form.topic) errors.value.topic = 'Choose a topic so we can guide your inquiry.'
  if (form.message.trim().length < 10)
    errors.value.message = 'Tell us a little more (at least 10 characters).'
  await nextTick()
  if (Object.keys(errors.value).length)
    document.getElementById(Object.keys(errors.value)[0])?.focus()
  else {
    submitted.value = true
    await nextTick()
    document.getElementById('form-success')?.focus()
  }
}
</script>
<template>
  <section class="page-intro container">
    <h2 class="section-title">Every possibility<br />starts with a hello.</h2>
    <p>
      A question about a program? Curious about life at CCS? We’d love to point you in the right
      direction.
    </p>
  </section>
  <section class="container contact-grid section-bottom">
    <div class="contact-details">
      <h2>Find your way to us.</h2>
      <a class="contact-method" href="mailto:ccssec@cpu.edu.ph"
        ><span><Icon name="mail" /></span>
        <div><small>Email the college</small><strong>ccssec@cpu.edu.ph</strong></div>
        <Icon name="arrow-up-right" :size="19" /></a
      ><a class="contact-method" href="tel:+63333291971"
        ><span><Icon name="phone" /></span>
        <div>
          <small>Call the college</small><strong>(033) 329-1971</strong>
          <p>Ask for local 1094</p>
        </div>
        <Icon name="arrow-up-right" :size="19"
      /></a>
      <div class="contact-method">
        <span><Icon name="pin" /></span>
        <div>
          <small>Visit our home</small><strong>Mary Thomas Hall</strong>
          <p>
            Central Philippine University<br />Lopez Jaena Street, Jaro<br />Iloilo City,
            Philippines
          </p>
        </div>
      </div>
      <a
        class="location-card"
        href="https://www.google.com/maps/search/?api=1&query=Mary+Thomas+Hall+Central+Philippine+University+Iloilo"
        target="_blank"
        rel="noopener noreferrer"
        ><img :src="imagePath('campus.jpg')" alt="Mary Thomas Hall at CPU" /><span
          >Get directions <Icon name="arrow-up-right" :size="20" /></span
      ></a>
    </div>
    <div class="contact-form-panel">
      <template v-if="!submitted"
        ><div class="form-header">
          <span class="form-illustration" aria-hidden="true"><Icon name="arrow-up-right" :size="24" /></span>
          <h2>What’s on your mind?</h2>
          <p>Start your inquiry below.</p>
        </div>
        <div class="demo-note">
          <strong>A little heads-up:</strong> this is a demonstration form. Nothing is sent or
          stored. You can open an email draft after reviewing your inquiry.
        </div>
        <form novalidate @submit.prevent="submit">
          <div class="form-row">
            <label for="name"
              >Your name <span>*</span
              ><input
                id="name"
                v-model="form.name"
                name="name"
                autocomplete="name"
                placeholder="Juan Dela Cruz"
                required
                maxlength="100"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : undefined"
              /><small v-if="errors.name" id="name-error" class="field-error">{{
                errors.name
              }}</small></label
            ><label for="email"
              >Email address <span>*</span
              ><input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                required
                maxlength="254"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'email-error' : undefined"
              /><small v-if="errors.email" id="email-error" class="field-error">{{
                errors.email
              }}</small></label
            >
          </div>
          <label for="topic"
            >What would you like to talk about? <span>*</span
            ><select
              id="topic"
              v-model="form.topic"
              required
              :aria-invalid="!!errors.topic"
              :aria-describedby="errors.topic ? 'topic-error' : undefined"
            >
              <option disabled value="">Choose a topic</option>
              <option v-for="p in programs" :key="p.id" :value="p.code">
                {{ p.code }} — {{ p.name }}
              </option>
              <option value="Admissions">Admissions and enrollment</option>
              <option value="General inquiry">General inquiry</option></select
            ><small v-if="errors.topic" id="topic-error" class="field-error">{{
              errors.topic
            }}</small></label
          ><label for="message"
            >Your message <span>*</span
            ><textarea
              id="message"
              v-model="form.message"
              rows="5"
              placeholder="Tell us a little about what you’re looking for…"
              required
              minlength="10"
              maxlength="3000"
              :aria-invalid="!!errors.message"
              :aria-describedby="errors.message ? 'message-error' : undefined"
            ></textarea
            ><small v-if="errors.message" id="message-error" class="field-error">{{
              errors.message
            }}</small></label
          ><button type="submit" class="button button-navy">
            Review my inquiry <Icon name="arrow-up-right" :size="19" />
          </button>
          <p class="form-footnote">Fields marked * are required. Your details stay in this page.</p>
        </form></template
      >
      <div v-else id="form-success" class="form-success" tabindex="-1">
        <span class="success-icon"><Icon name="check" :size="36" /></span>
        <h2>Looking good, {{ form.name.split(' ')[0] }}.</h2>
        <p>
          Your inquiry is ready to review. <strong>Nothing has been sent.</strong> Open it in your
          email app when you’re ready.
        </p>
        <dl class="inquiry-preview">
          <dt>From</dt>
          <dd>{{ form.name }} · {{ form.email }}</dd>
          <dt>Topic</dt>
          <dd>{{ form.topic }}</dd>
          <dt>Message</dt>
          <dd class="message-preview">{{ form.message }}</dd>
        </dl>
        <a :href="emailDraft" class="button button-navy"
          >Open email draft <Icon name="mail" :size="19" /></a
        ><button class="text-link edit-inquiry" @click="submitted = false">
          Edit my inquiry <Icon name="arrow-left" :size="17" />
        </button>
      </div>
    </div>
  </section>
</template>
