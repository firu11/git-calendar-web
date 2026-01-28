<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DayTimeline from '@/components/DayTimeline.vue';
import type { CalendarEvent } from '@/types/core.ts';
import { useSettings } from '@/composables/useSettings';
import { useTranslation } from '@/composables/useTranslation';
import { DateTime } from 'luxon';
import { CalendarCore } from '@/wasm/core-wrapper';

const { settings } = useSettings();
const { dayName } = useTranslation();

interface Props {
  startDate: DateTime;
}
const props = defineProps<Props>();

const weekDates = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    return props.startDate.plus({ days: i });
  });
});

const hoursOnGrid = computed(() => {
  const start = settings.value.dayViewStartHour;
  const end = settings.value.dayViewEndHour;

  const result: string[] = [];

  let current = start;
  while (true) {
    // resolve formats manually ig
    if (settings.value.timeFormat === 'h12') {
      const h = current % 12 || 12; // O -> 12
      const period = current < 12 ? 'am' : 'pm';
      result.push(`${h} ${period}`);
    } else {
      result.push(`${String(current).padStart(2, '0')}:00`);
    }

    current = (current + 1) % 24;

    // stop BEFORE adding the end hour
    if (current === end) break;

    if (result.length > 48) break; // prevent infinite loop
  }

  return result;
});

const eventsByDay = ref<CalendarEvent[][]>(Array.from({ length: 7 }, () => []));

onMounted(async () => {
  const events = await CalendarCore.getEvents(DateTime.now(), DateTime.now());

  for (const event of events) {
    // normalize to start of day
    const eventDate = event.from.startOf('day');

    // calculate the difference in days
    const diffInDays = eventDate.diff(props.startDate.startOf('day'), 'days').days;
    const dayIndex = Math.floor(diffInDays);

    // add it to appropriate day
    if (dayIndex >= 0 && dayIndex < 7) {
      eventsByDay.value[dayIndex]?.push(event);
    }
  }
});
</script>

<template>
  <div id="week-view-container">
    <div id="top-bar">
      <span v-for="day in weekDates">{{ dayName(day) }}</span>
    </div>
    <div id="left-time-bar">
      <span v-for="h in hoursOnGrid">{{ h }}</span>
    </div>

    <div id="content">
      <div class="hour-lines">
        <div
          v-for="hour in hoursOnGrid.length"
          :key="hour"
          class="hour-line"
          :style="{ top: (hour / hoursOnGrid.length) * 100 + '%' }"
        ></div>
      </div>

      <DayTimeline v-for="(d, i) in weekDates" :date="d" :numOfHours="hoursOnGrid.length" :events="eventsByDay[i]!" />
    </div>
  </div>
</template>

<style scoped>
#week-view-container {
  height: calc(100% - 2rem);

  display: grid;
  grid-template-columns: 3rem auto;
  grid-template-rows: 2rem auto;
  grid-template-areas:
    '- topbar'
    'timebar content';

  position: relative;
  margin: 1rem;

  /*grid-template-rows: 100%;
  grid-template-columns: 1fr;*/
}

#top-bar,
#content {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(7, 1fr);
}

#content {
  position: relative;
  border-right: var(--grid-border); /* add the missing border for the grid */
  grid-area: content;
}

#top-bar {
  border-bottom: var(--grid-border);
  grid-area: topbar;
}

#left-time-bar {
  grid-area: timebar;
  display: grid;

  span {
    border-top: 1px solid transparent;
    font-size: 0.8rem;
    text-align: right;
    padding-right: 0.6rem;

    position: relative;
    top: -0.5rem;
  }
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
  height: var(--grid-thickness);
  background: var(--grid-color);
}
</style>
