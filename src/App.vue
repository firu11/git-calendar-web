<script setup lang="ts">
import LoadingView from '@/views/LoadingView.vue';
import { useSettings } from '@/composables/useSettings.ts';
import { CalendarCore, CoreLoadingState } from '@/wasm/core-wrapper';
import { onBeforeMount, ref } from 'vue';

const { settings } = useSettings();
const coreReady = ref(false); // waits for loadCalendars etc.

onBeforeMount(async () => {
  try {
    await CalendarCore.setCorsProxy(settings.value.corsProxyURL);
  } catch {
    // TODO
  }

  await CalendarCore.createCalendar('main', '');
  await CalendarCore.loadCalendars();
  coreReady.value = true;
});
</script>

<template>
  <LoadingView v-if="CoreLoadingState.percentage < 100 || !coreReady" />
  <RouterView v-else />
</template>

<style scoped>
main {
  height: 100%;
}
</style>
