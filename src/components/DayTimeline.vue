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

// Convert a Date to a fraction of the timeline (0..1)
const getEventPosition = (event: CalendarEvent) => {
  const dayStart = new Date(props.date);
  dayStart.setHours(0, 0, 0, 0);

  const eventStartHours = event.from.getHours() + event.from.getMinutes() / 60;
  const eventEndHours = event.to.getHours() + event.to.getMinutes() / 60;

  const start = Math.max(0, eventStartHours / props.numOfHours);
  const end = Math.min(1, eventEndHours / props.numOfHours);

  return { start, end };
};

function getEventStylePos(e: CalendarEvent) {
  const pos = getEventPosition(e);
  return {
    top: pos.start * 100 + '%',
    height: (pos.end - pos.start) * 100 + '%',
  };
}
</script>

<template>
  <div class="day-timeline">
    <span class="day-label">{{ dayName }}</span>

    <div class="timeline-grid">
      <div class="hour-lines">
        <div
          v-for="hour in numOfHours"
          :key="hour"
          class="hour-line"
          :style="{ top: (hour / numOfHours) * 100 + '%' }"
        ></div>
      </div>

      <div v-for="e in events" :key="e.id" class="timeline-event" :style="getEventStylePos(e)">
        {{ e.title }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-timeline {
  position: relative;
}

.timeline-grid {
  position: relative;
  height: 30rem;
  width: 100%;
}

.hour-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* allow clicking events */
}

.hour-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--text-color);
  opacity: 0.2;
}

.timeline-event {
  position: absolute;
  left: 0;
  right: 0;
  background-color: rgba(100, 149, 237, 0.5);
  border-left: 3px solid #6495ed;
  padding: 0.2rem;
  font-size: 0.75rem;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
