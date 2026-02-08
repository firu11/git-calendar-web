<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation';
import router from '@/router';
import { getCurrentViewDatetime } from '@/utils';
import { DateTime } from 'luxon';
import { computed, ref, watch } from 'vue';
import { FiChevronDown, FiChevronUp } from 'vue-icons-plus/fi';
import { useRoute } from 'vue-router';

const { monthNameLong } = useTranslation();
const route = useRoute();

watch(
  () => route.params,
  () => {
    currentDatetime.value = getCurrentViewDatetime(route.params);

    monthTracker.value = currentDatetime.value.month;
    yearTracker.value = currentDatetime.value.year;
  },
);

const currentDatetime = ref(getCurrentViewDatetime(route.params));

const highlightedWeekNum = computed(() => {
  return currentDatetime.value.weekNumber;
});

const monthTracker = ref(currentDatetime.value.month);
const yearTracker = ref(currentDatetime.value.year);

function changeMonthNum(up: boolean) {
  if (up) monthTracker.value++;
  else monthTracker.value--;

  // handle year jumps
  if (monthTracker.value >= 13) {
    monthTracker.value = 1;
    yearTracker.value++;
  } else if (monthTracker.value <= 0) {
    monthTracker.value = 12;
    yearTracker.value--;
  }
}

const days = computed(() => {
  const firstOfTheMonth = DateTime.now().set({ year: yearTracker.value, month: monthTracker.value, day: 1 });

  const result: DateTime[] = [];

  // trailing days from previous month
  const numOfDaysFromLastMonth = firstOfTheMonth.weekday - 1;
  for (let i = numOfDaysFromLastMonth; i > 0; i--) {
    result.push(firstOfTheMonth.minus({ days: i }));
  }

  // add more days until we fill at least 42 cells (6×7)
  const moreDaysNeeded = 6 * 7 - result.length;
  for (let i = 0; i < moreDaysNeeded; i++) {
    result.push(firstOfTheMonth.plus({ days: i }));
  }

  return result;
});

const weeks = computed(() => {
  const chunks = [];
  for (let i = 0; i < days.value.length; i += 7) {
    chunks.push(days.value.slice(i, i + 7));
  }
  return chunks;
});
</script>

<template>
  <div id="month-side-map">
    <div class="container">
      <span id="month-name">
        {{ `${monthNameLong(DateTime.now().set({ month: monthTracker }))} ${yearTracker}` }}
      </span>
      <span id="month-nav">
        <button @click="changeMonthNum(false)"><FiChevronUp /></button>
        <button @click="changeMonthNum(true)"><FiChevronDown /></button>
      </span>
    </div>

    <div id="day-grid">
      <div v-for="i in 7" class="day-name">
        {{ days[i - 1]?.weekdayShort?.slice(0, 2) }}
      </div>

      <div
        v-for="(week, wIndex) in weeks"
        :key="wIndex"
        class="week-row"
        :class="{ 'highlighted-week': week[0]?.weekNumber == highlightedWeekNum }"
        @click="router.replace({ params: { month: week[0]?.month, day: week[0]?.day } })"
      >
        <div
          v-for="d in week"
          :key="d.day"
          class="day"
          :class="{
            today: d.hasSame(DateTime.now(), 'day'),
            'not-this-month': d.month !== monthTracker,
          }"
        >
          {{ d.day }}
        </div>
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
    padding-left: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
  }
}

#month-nav {
  display: flex;
  gap: 0.2rem;

  button {
    width: 1.8rem;
    height: 1.8rem;
    padding: 7%;
    border-radius: var(--small-border-radius);

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--sidebar-hover-color);
    }
  }
}

#day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  .day-name {
    text-align: center;
    font-size: 0.8rem;
    text-transform: uppercase;
    opacity: 0.5;
    padding-bottom: 0.5rem;
  }

  .week-row {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    border: 1px transparent solid;
    border-radius: var(--small-border-radius);

    &.highlighted-week {
      background-color: var(--git-color) !important;
      color: var(--text-color-hard);

      .day.not-this-month {
        opacity: 0.7;
      }
    }

    &:hover {
      background-color: var(--sidebar-hover-color);
    }
  }

  .day {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    border-radius: var(--small-border-radius);
    cursor: pointer;

    &.today {
      font-weight: 900;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 3px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: currentColor;
      }
    }

    &.not-this-month {
      opacity: 0.3;
    }
  }
}
</style>
