<script setup lang="ts">
import { computed } from 'vue';
import { useSettings } from '@/composables/useSettings.ts';
import type { CalendarEvent } from '@/types/core.ts';

const { settings } = useSettings();

interface Props {
  date: Date;
  numOfHours: number;
  events: CalendarEvent[];
}
const props = defineProps<Props>();

const dayName = computed(() => {
  return new Intl.DateTimeFormat(settings.value.language, { weekday: 'short' })
    .format(props.date)
    .toLowerCase();
});
</script>

<template>
  <div class="day-timeline">
    <span>{{ dayName }}</span>
    <div class="timeline-event" v-for="i in numOfHours">{{ i }}</div>
  </div>
</template>

<style scoped>
.day-timeline {
  display: grid;

  /*height: 100%;*/
}

.timeline-event {
  padding: 0.2rem;
}
</style>
