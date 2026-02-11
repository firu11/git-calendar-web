<script setup lang="ts">
import DaysDisplay from '@/components/DaysDisplay.vue';
import SideBar from '@/components/SideBar.vue';
import MonthSideMap from '@/components/MonthSideMap.vue';
import TopBar from '@/components/TopBar.vue';
import EventGroups from '@/components/EventGroups.vue';

import { calendarViewValues, useSettings, type CalendarView } from '@/composables/useSettings';
import { computed, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

import { useKeyboard } from '@/composables/useKeyboard';
useKeyboard();

const { settings } = useSettings();
const route = useRoute();

const activeView: ComputedRef<CalendarView> = computed(() => {
  const param = route.params.view;
  if (!param) {
    return settings.value.defaultView;
  }
  const viewParam = Array.isArray(param) ? param[0] : String(param); // convert to string

  if (calendarViewValues.includes(viewParam as CalendarView)) {
    return viewParam as CalendarView;
  }
  return settings.value.defaultView;
});

const views = {
  week: [DaysDisplay, 7],
  '4days': [null, 4], //[DaysDisplay, 4],
  month: [null, null],
};
</script>

<template>
  <div id="calendar-view">
    <SideBar>
      <MonthSideMap />
      <EventGroups />
    </SideBar>
    <TopBar></TopBar>
    <component :is="views[activeView][0]" :num-of-days="views[activeView][1]" />
  </div>
</template>

<style scoped>
#calendar-view {
  display: grid;
  grid-template-columns: var(--sidebar-width) auto;
  grid-template-rows: var(--topbar-height) auto;
  grid-template-areas:
    'sidebar topbar'
    'sidebar content';

  height: 100%;
}

component {
  background-color: red;
}
</style>
