<script setup lang="ts">
import { DateTime } from 'luxon';
import type { CalendarEvent } from '@/types/core';
import { useSettings } from '@/composables/useSettings';

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

// Formats times based on timeFormat (17/5 pm) and puts it together like: '10:00 - 11:30'.
function timeRangeFormat(from: DateTime, to: DateTime): string {
  const fromTime = from.toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: settings.value.timeFormat });
  const toTime = to.toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: settings.value.timeFormat });
  return `${fromTime} - ${toTime}`;
}
</script>

<template>
  <div class="timeline-event" :style="getEventStylePos(event)">
    <span>{{ event.title }}</span>
    <br />
    <span>{{ timeRangeFormat(event.from, event.to) }}</span>
  </div>
</template>

<style scoped></style>
