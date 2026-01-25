<script setup lang="ts">
import WeekDisplay from '@/components/WeekDisplay.vue';
import { useSettings } from '@/composables/useSettings';
import { computed, ref } from 'vue';
import { DateTime, Duration } from 'luxon';

const { settings } = useSettings();

const viewName = ref(settings.value.defaultView);

const today = DateTime.now();

const startOfTheWeek = computed(() => {
  const diff = Math.abs(settings.value.weekStart - today.weekday);
  const startDate = today.minus(Duration.fromObject({ days: diff }));

  startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }); // maybe not needed
  return startDate;
});
</script>

<template>
  <WeekDisplay v-if="viewName === 'week'" :startDate="startOfTheWeek" />
</template>

<style scoped></style>
