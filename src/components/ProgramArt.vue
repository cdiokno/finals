<script setup>
defineProps({ program: Object })
</script>
<template>
  <div class="program-art" :class="program.id" aria-hidden="true">
    <template v-if="program.id === 'bsit'"
      ><div class="network-line line-one"></div>
      <div class="network-line line-two"></div>
      <span class="network-node node-one"></span><span class="network-node node-two"></span
      ><span class="network-node node-three"></span
      ><span class="network-center">{<span>•</span>}</span></template
    >
    <template v-else-if="program.id === 'bscs'"
      ><div class="art-terminal">
        <div class="terminal-dots"><i></i><i></i><i></i></div>
        <span class="terminal-code">&lt;<b>/</b>&gt;<span class="code-cursor">_</span></span
        ><span class="terminal-caption">hello, possibility.</span>
      </div>
      <span class="art-orbit">✦</span></template
    >
    <template v-else-if="program.id === 'bsdmia'"
      ><span class="art-flower">✳</span><span class="art-sphere"></span>
      <div class="art-cursor">
        <svg viewBox="0 0 50 60">
          <path d="M5 4L43 34L26 36L19 53Z" fill="#182850" stroke="white" stroke-width="3" />
        </svg></div
    ></template>
    <template v-else
      ><span class="art-book book-one"></span><span class="art-book book-two"></span
      ><span class="art-book book-three">Aa</span><span class="book-spark">✧</span></template
    >
  </div>
</template>
