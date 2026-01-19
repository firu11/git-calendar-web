<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DayTimeline from '@/components/DayTimeline.vue';
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
  const now = new Date();

  return [
    {
      id: 1,
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      location: 'Meeting Room A',
      from: new Date(new Date(now).setHours(12, 0, 0, 0)),
      to: new Date(new Date(now).setHours(15, 0, 0, 0)),
    },
    {
      id: 2,
      title: 'Tuesday Gym Session',
      location: 'Fitness Center',
      from: new Date(new Date(new Date(now).setDate(now.getDate() + 1)).setHours(8, 0, 0, 0)),
      to: new Date(new Date(new Date(now).setDate(now.getDate() + 1)).setHours(10, 0, 0, 0)),
    },
    {
      id: 3,
      title: 'Wednesday Deep Work',
      location: 'Home Office',
      from: new Date(new Date(new Date(now).setDate(now.getDate() + 1)).setHours(8, 30, 0, 0)),
      to: new Date(new Date(new Date(now).setDate(now.getDate() + 1)).setHours(10, 30, 0, 0)),
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

function getDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const eventsByDay = ref<CalendarEvent[][]>(Array.from({ length: 7 }, () => []));

onMounted(() => {
  const events = fakeGetEvents();
  for (const event of events) {
    const eventDate = getDateOnly(event.from);

    const dayIndex = Math.floor(
      (eventDate.getTime() - props.startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayIndex >= 0 && dayIndex < 7) {
      eventsByDay.value[dayIndex]?.push(event);
    }
  }
});
</script>

<template>
  <div id="week-view-container">
    <DayTimeline
      v-for="(d, i) in weekDates"
      :date="d"
      :numOfHours="numOfHoursOnGrid"
      :events="eventsByDay[i]!"
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
