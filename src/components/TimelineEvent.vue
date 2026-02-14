<script setup lang="ts">
import type { CalendarEvent } from '@/types/core';
import { useSettings } from '@/composables/useSettings';
import BaseEvent from '@/components/BaseEvent.vue';
import { timeRangeFormat } from '@/utils';

const { settings } = useSettings();

interface Props {
  numOfHours: number;
  event: CalendarEvent;
}
const props = defineProps<Props>();

// Calculates the start and end positions for event.
function getEventPosition(event: CalendarEvent): { start: number; end: number } {
  const eventStartHours = event.from.hour + event.from.minute / 60;
  const eventEndHours = event.to.hour + event.to.minute / 60;
  const viewStart = settings.value.dayViewStartHour;

  const start = Math.max(0, (eventStartHours - viewStart) / props.numOfHours);
  const end = Math.min(1, (eventEndHours - viewStart) / props.numOfHours);

  return { start, end };
}

// Calculates the height and Y pos for event.
function getEventStylePos(e: CalendarEvent) {
  const pos = getEventPosition(e);
  return {
    top: `${pos.start * 100}%`,
    height: `${(pos.end - pos.start) * 100}%`,
  };
}
</script>

<template>
  <BaseEvent
    :top-style="getEventStylePos(event).top"
    :height-style="getEventStylePos(event).height"
    :title="event.title"
    :subtitle="timeRangeFormat(event.from, event.to)"
  />
</template>

<style>
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

  user-select: none;
}
</style>
