<script setup lang="ts">
import WeekDisplay from '@/components/WeekDisplay.vue';
import SideBar from '@/components/SideBar.vue';
import MonthSideMap from '@/components/MonthSideMap.vue';
import { useSettings } from '@/composables/useSettings';
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';

const { settings } = useSettings();

const activeView = ref(settings.value.defaultView);
const views = {
  week: WeekDisplay,
  '4days': null,
  month: null,
};

const today = DateTime.now();
const offset = ref(0);

const startOfTheWeek = computed(() => {
  const diff = (today.weekday - settings.value.weekStart + 7) % 7;
  const startDate = today.minus({ days: diff, weeks: offset.value });

  startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }); // maybe not needed
  return startDate;
});
</script>

<template>
  <div id="calendar-view">
    <SideBar>
      <MonthSideMap
        :year="startOfTheWeek.year"
        :month-number="startOfTheWeek.month"
        :highlighted-week-number="startOfTheWeek.weekNumber"
      />
    </SideBar>
    <component :is="views[activeView]" :start-date="startOfTheWeek"></component>
  </div>
</template>

<style scoped>
#calendar-view {
  display: grid;
  grid-template-columns: var(--sidebar-width) auto;
  grid-template-rows: var(--);
  grid-auto-flow: row;

  height: 100%;
}
</style>
