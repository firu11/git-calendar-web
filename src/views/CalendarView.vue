<script setup lang="ts">
import WeekDisplay from '@/components/WeekDisplay.vue';
import { useSettings } from '@/composables/useSettings';
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';

const { settings } = useSettings();

const viewName = ref(settings.value.defaultView);

const d = DateTime.now();

const startOfTheWeek = computed(() => {
  const todaysDay = d.weekday;
  const diff = d.day - todaysDay + (todaysDay === 1 ? -6 : 1);
  const monday = d.minus(diff);
  monday.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }); // maybe not needed
  return monday;
});
</script>

<template>
  <WeekDisplay v-if="viewName === 'week'" :startDate="startOfTheWeek" />
</template>

<style scoped></style>
