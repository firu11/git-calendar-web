<script setup lang="ts">
import WeekDisplay from '@/components/WeekDisplay.vue';
import SideBar from '@/components/SideBar.vue';
import { useSettings } from '@/composables/useSettings';
import { computed, ref } from 'vue';
import { DateTime, Duration } from 'luxon';

const { settings } = useSettings();

const viewName = ref(settings.value.defaultView);

const today = DateTime.now();

const startOfTheWeek = computed(() => {
  const diff = (today.weekday - settings.value.weekStart + 7) % 7;
  const startDate = today.minus(Duration.fromObject({ days: diff }));

  startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }); // maybe not needed
  return startDate;
});
</script>

<template>
  <div id="calendar-view">
    <SideBar />
    <WeekDisplay v-if="viewName === 'week'" :startDate="startOfTheWeek" />
  </div>
</template>

<style scoped>
#calendar-view {
  display: grid;
  grid-template-columns: var(--sidebar-width) auto;
  grid-auto-flow: row;

  height: 100%;
}
</style>
