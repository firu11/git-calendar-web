<script setup lang="ts">
import { DateTime } from 'luxon';

interface Props {
  monthNumber: number;
  highlightedWeekNumber: number;
}
const props = defineProps<Props>();
</script>

<template>
  <div id="month-side-map">
    <span id="month-name">{{ DateTime.now().set({ month: monthNumber }).monthLong }}</span>
    <div id="day-grid">
      <div v-for="dayIndex in 6 * 7" class="day">
        {{ dayIndex }}
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

  #month-name {
    align-self: flex-end;
    padding-right: 0.5rem;
  }
}

#day-grid {
  display: grid;
  grid-template-rows: repeat(6, 1fr); /* 6 weeks */
  grid-template-columns: repeat(7, 1fr); /* 7 days */
  justify-items: center;
}
</style>
