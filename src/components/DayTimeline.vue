<script setup lang="ts">
import { computed } from 'vue';
import type { CalendarEvent } from '@/types/core.ts';
import type { DateTime } from 'luxon';
import TimelineEvent from './TimelineEvent.vue';

interface Props {
  date: DateTime;
  numOfHours: number;
  events: CalendarEvent[];
}
const props = defineProps<Props>();

// expects events to be sorted by "from" beforehand in Wasm
const nonoverlappingGroups = computed(() => {
  if (!props.events || props.events.length === 0) return [];

  // each inner array is a lane/timeline
  const lanes: CalendarEvent[][] = [];

  for (const event of props.events) {
    let placed = false;

    // try to find an existing lane where this event fits
    for (const lane of lanes) {
      const lastEventInLane = lane[lane.length - 1]!;

      // if the event starts after (or when) the last event in this lane ends
      if (event.from.toSeconds() >= lastEventInLane.to.toSeconds()) {
        lane.push(event);
        placed = true;
        break;
      }
    }

    // if it overlapped with the end of every existing lane, create a new lane
    if (!placed) {
      lanes.push([event]);
    }
  }

  return lanes;
});
</script>

<template>
  <div class="day-timeline">
    <div class="timeline-grid">
      <div class="timeline-group" v-for="g in nonoverlappingGroups">
        <TimelineEvent v-for="e in g" :key="e.id" :event="e" :numOfHours="props.numOfHours" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-timeline {
  border-left: var(--grid-border);
  position: relative;
}

.timeline-grid {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  gap: 0.5rem;
  height: 100%;
}

.timeline-group {
  position: relative;
}
</style>
