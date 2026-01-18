<script setup lang="ts">
import { CalendarCore } from '@/wasm/core-wrapper';

interface Props {
  date: Date;
}
const props = defineProps<Props>();
</script>

<template>
  {{ props.date.toDateString().slice(0, 3) }}
  <div class="day-timeline-container">
    <div class="event-timeline" v-for="i in 10">{{ i }}</div>
  </div>
</template>

<style scoped>
.day-timeline-container {
  display: grid;
  /*height: 100%;*/
}

.event-timeline {
  padding: 0.2em;
}
</style>
