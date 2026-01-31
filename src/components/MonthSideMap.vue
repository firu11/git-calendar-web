<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation';
import { DateTime, Duration } from 'luxon';
import { computed, ref } from 'vue';

const { monthNameLong } = useTranslation();

interface Props {
  year: number;
  monthNumber: number;
  highlightedWeekNumber: number;
}
const props = defineProps<Props>();

const monthNumberTracker = ref(props.monthNumber);
const yearTracker = ref(props.year);

function changeMonthNum(up: boolean) {
  if (up) monthNumberTracker.value++;
  else monthNumberTracker.value--;

  // handle year jumps
  if (monthNumberTracker.value >= 13) {
    monthNumberTracker.value = 1;
    yearTracker.value++;
  } else if (monthNumberTracker.value <= 0) {
    monthNumberTracker.value = 12;
    yearTracker.value--;
  }
}

const days = computed(() => {
  const firstOfTheMonth = DateTime.now().set({ year: yearTracker.value, month: monthNumberTracker.value, day: 1 });

  const result: DateTime[] = [];

  const numOfDaysFromLastMonth = firstOfTheMonth.weekday - 1;
  for (let i = numOfDaysFromLastMonth; i > 0; i--) {
    result.push(firstOfTheMonth.minus(Duration.fromObject({ days: i })));
  }

  const moreDaysNeeded = 6 * 7 - result.length;
  for (let i = 0; i < moreDaysNeeded; i++) {
    result.push(firstOfTheMonth.plus(Duration.fromObject({ days: i })));
  }

  return result;
});
</script>

<template>
  <div id="month-side-map">
    <div class="container">
      <span id="month-name">
        {{ `${monthNameLong(DateTime.now().set({ month: monthNumberTracker }))} ${yearTracker}` }}
      </span>
      <span id="month-nav">
        <button @click="changeMonthNum(false)">&lt;</button>
        <button @click="changeMonthNum(true)">&gt;</button>
      </span>
    </div>
    <div id="day-grid">
      <div v-for="i in 7" class="day-name">{{ days[i - 1]?.weekdayShort?.charAt(0).toLocaleLowerCase() }}</div>
      <div
        v-for="d in days"
        class="day"
        :class="{
          notThisMonth: d.month !== monthNumberTracker,
          today: d.hasSame(DateTime.now(), 'day'),
        }"
      >
        {{ d.day }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#month-side-map {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .container {
    padding-left: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
}

#month-nav {
  display: flex;

  button {
    width: 1.8rem;
    border: none;
    background-color: transparent;
    color: var(--text-color);

    background-color: transparent;
    cursor: pointer;
    border-radius: 3px;

    &:hover {
      background-color: var(--sidebar-hover-color);
    }
  }
}

#day-grid {
  display: grid;
  gap: 0.2rem;
  grid-template-rows: repeat(6, auto); /* 6 weeks */
  grid-template-columns: repeat(7, 1fr); /* 7 days */

  overflow: hidden; /* cut off the line */

  .day-name {
    text-align: center;
    position: relative;
    padding-bottom: 0.5rem;

    /* add underline */
    &::after {
      content: '';
      position: absolute;
      left: -0.1rem;
      right: -0.1rem;
      bottom: 0.3rem;
      height: 1px;
      background: var(--text-color);
      pointer-events: none;
    }
  }

  .day {
    text-align: center;
    cursor: pointer;
    border-radius: 3px;
    height: 1.5rem;
    line-height: 1.5rem;

    &:hover {
      background-color: var(--sidebar-hover-color);
    }
  }

  .notThisMonth {
    opacity: 0.5;
  }

  .today {
    border: 1px solid var(--text-color);
  }
}
</style>
