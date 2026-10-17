<script setup>
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ChevronDown,
  X,
  Menu,
  Search,
  MapPin,
  Mail,
  Phone,
  Code2,
  Network,
  Sparkles,
  BookOpen,
  Check,
  Plus,
  Pause,
  Play,
  ExternalLink,
  GraduationCap,
} from '@lucide/vue'
defineProps({
  name: { type: String, default: 'arrow-right' },
  size: { type: [Number, String], default: 20 },
})
const icons = {
  'arrow-up-right': ArrowUpRight,
  'arrow-right': ArrowRight,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  chevron: ChevronDown,
  close: X,
  menu: Menu,
  search: Search,
  pin: MapPin,
  mail: Mail,
  phone: Phone,
  code: Code2,
  network: Network,
  sparkles: Sparkles,
  book: BookOpen,
  check: Check,
  plus: Plus,
  pause: Pause,
  play: Play,
  external: ExternalLink,
  graduation: GraduationCap,
}
</script>
<template>
  <component :is="icons[name] || ArrowRight" :size="size" :stroke-width="1.7" aria-hidden="true" />
</template>
