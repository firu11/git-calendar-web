<script setup lang="ts">
import XDaysView from '@/components/timeline/XDaysView.vue';
import SideBar from '@/components/SideBar.vue';
import MonthSideMap from '@/components/MonthSideMap.vue';
import TopBar from '@/components/TopBar.vue';
import CalendarList from '@/components/CalendarList.vue';
import EventModal from '@/components/EventModal.vue';
import CalendarModal from '@/components/CalendarModal.vue';

import { computed, type ComputedRef, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { calendarViewValues, useSettings, type CalendarView } from '@/composables/useSettings';
import { useKeyboard } from '@/composables/useKeyboard';
import { useCalendarModal } from '@/composables/useCalendarModal';
import { useEventModal } from '@/composables/useEventModal';

useKeyboard();
const calendarModal = useCalendarModal();
const eventModal = useEventModal();
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
  week: [XDaysView, 7],
  '4days': [null, 4], //[XDaysView, 4],
  month: [null, null],
};

const viewComponent = useTemplateRef('calendar-view');
const calendarsList = useTemplateRef('calendars-list');
function updateCallDown() {
  viewComponent.value?.updateData();
  calendarsList.value?.updateData();
}
</script>

<template>
  <span id="alpha">Alpha version</span>
  <div id="calendar-view">
    <SideBar>
      <MonthSideMap />
      <CalendarList ref="calendars-list" @refresh-data="updateCallDown" />
    </SideBar>

    <TopBar />
    <component :is="views[activeView][0]" :num-of-days="views[activeView][1]" ref="calendar-view" />

    <EventModal v-if="eventModal.isOpen.value" @refresh-data="updateCallDown" />
    <CalendarModal v-if="calendarModal.isOpen.value" @refresh-data="updateCallDown" />
  </div>
</template>

<style scoped>
#alpha {
  position: absolute;
  top: 1rem;
  left: calc(var(--sidebar-width) + 1rem);
  padding: 0.1rem 0.3rem;

  font-size: 0.7rem;
  font-weight: bold;
  color: var(--git-color);
  border: 1px solid var(--git-color);
  border-radius: 2rem;
}

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

/* mobile TODO better */
@media (max-width: 768px) {
  aside {
    display: none !important;
  }

  #calendar-view {
    grid-template-columns: auto;
    grid-template-areas:
      'topbar'
      'content';
  }
}
</style>
