<script setup lang="ts">
import DayTimeline from '@/components/DayTimeline.vue';
import { computed, onMounted } from 'vue';
import type { CalendarEvent } from '@/types/core.ts';
import { useSettings } from '@/composables/useSettings';

const { settings } = useSettings();

interface Props {
  startDate?: Date;
}
const props = withDefaults(defineProps<Props>(), {
  startDate: () => {
    // default is this weeks Monday (TODO support for starting on Sunday ew)
    const now = new Date();
    const todaysDay = now.getDay(); // 0 (Sun) 1 (Mon) ... 6 (Sat) bruh

    // Calculate distance to Monday
    // If today is Sunday (0), we go back 6 days.
    // Otherwise, we go back (day - 1) days.
    const diff = now.getDate() - todaysDay + (todaysDay === 0 ? -6 : 1);

    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0); // maybe not needed

    return monday;
  },
});

function fakeGetEvents(): CalendarEvent[] {
  return [
    {
      id: 1,
      title: 'Monday Morning Standup',
      location: 'Meeting Room A',
      from: 29462820,
      to: 29462850,
    },
    {
      id: 2,
      title: 'Tuesday Gym Session',
      location: 'Fitness Center',
      from: 29464320,
      to: 29464410,
    },
    {
      id: 3,
      title: 'Wednesday Deep Work',
      location: 'Home Office',
      from: 29465700,
      to: 29465880,
    },
    {
      id: 4,
      title: 'Wednesday Lunch Meeting (OVERLAP)',
      location: 'Cafe Deluxe',
      from: 29465820,
      to: 29465880,
    },
    {
      id: 5,
      title: 'Thursday Project Review',
      location: 'Zoom',
      from: 29467260,
      to: 29467320,
    },
    {
      id: 6,
      title: 'Friday Happy Hour',
      location: 'The Local Pub',
      from: 29468760,
      to: 29468880,
    },
    {
      id: 7,
      title: 'Saturday Hiking',
      location: 'National Park',
      from: 29469900,
      to: 29470260,
    },
  ];
}

const weekDates = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(props.startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
});

const numOfHoursOnGrid = computed(() => {
  return settings.value.dayViewEndHour - settings.value.dayViewStartHour;
});

onMounted(() => {
  let events = fakeGetEvents();
  console.table(events);
});
</script>

<template>
  <div id="week-view-container">
    <DayTimeline
      v-for="d in weekDates"
      :date="d"
      :numOfHours="numOfHoursOnGrid"
      :events="fakeGetEvents()"
    />
  </div>
</template>

<style scoped>
#week-view-container {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(7, 1fr);
  padding: 1rem;

  /*grid-template-rows: 100%;
  grid-template-columns: 1fr;*/
}
</style>
