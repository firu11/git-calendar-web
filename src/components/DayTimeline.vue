<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';
import type { CalendarEvent } from '@/types/core.ts';
import { DateTime } from 'luxon';
import TimelineEvent from '@/components/TimelineEvent.vue';
import { useMouse } from '@vueuse/core';

const { x, y, sourceType } = useMouse();

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

const timelineRef = useTemplateRef('timeline-ref');
const drag = ref({ active: false, startY: 0 });
const placeholderEventStyle = computed(() => {
  const snapToGridHeight = timelineRef.value?.clientHeight! / props.numOfHours / 2;
  let heightSnap = y.value - timelineRef.value!.getBoundingClientRect().y - drag.value.startY;

  heightSnap = Math.max(1 * snapToGridHeight, heightSnap);
  heightSnap = Math.floor(heightSnap / snapToGridHeight) * snapToGridHeight;

  return {
    top: `${drag.value.startY}px`,
    height: `${heightSnap}px`,
  };
});

function dragStart(e: PointerEvent) {
  if (drag.value.active) return; // already dragging
  if ((e.target as Element).classList.contains('timeline-event')) return; // clicked on existing event

  drag.value.active = true;
  const snapToGridHeight = timelineRef.value?.clientHeight! / props.numOfHours / 2;

  let startY = y.value - timelineRef.value!.getBoundingClientRect().y;
  startY = Math.max(0, startY);
  startY = Math.floor(startY / snapToGridHeight) * snapToGridHeight;

  drag.value.startY = startY;

  window.addEventListener('pointerup', dragStop); // listen for stop
}

function dragStop(_: MouseEvent) {
  if (!drag.value.active) return; // not dragging

  drag.value.active = false;

  const endY = y.value - timelineRef.value!.getBoundingClientRect().y;
  let distance = endY - drag.value.startY;

  window.removeEventListener('pointerup', dragStop); // cleanup
}
</script>

<template>
  <div class="day-timeline" :class="{ 'drag-cursor': drag.active }" @pointerdown="dragStart" ref="timeline-ref">
    <div class="timeline-grid">
      <div class="timeline-event placeholder" v-if="drag.active" :style="placeholderEventStyle" />

      <div class="timeline-group" v-for="(g, i) in nonoverlappingGroups" :key="i">
        <TimelineEvent v-for="e in g" :key="e.id" :event="e" :num-of-hours="props.numOfHours" />
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

.drag-cursor {
  cursor: ns-resize;
}
</style>
