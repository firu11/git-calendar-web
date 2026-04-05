<script setup lang="ts">
import { ref, watch } from 'vue';
import { getStartOfWeek, moveView } from '@/utils';
import { DateTime } from 'luxon';
import { FiChevronLeft, FiChevronRight, FiSidebar } from 'vue-icons-plus/fi';
import { useRouter } from 'vue-router';
import MultiToggle from '@/components/MultiToggle.vue';

const emit = defineEmits(['sidebar-toggle']);
const router = useRouter();

const views = ['4days', 'Week', 'Month'];
const view = ref(capitalized(router.currentRoute.value.params.view.toString()));

function changeView(viewName: string) {
  view.value = viewName;
  router.push({ name: 'calendar', params: { view: view.value.toLowerCase() } });
}

function jumpToToday() {
  const today = DateTime.now();
  const params = router.currentRoute.value.params;

  if (params.view === 'week') {
    // special case for week
    const weekStart = getStartOfWeek(today);
    router.push({ name: 'calendar', params: { year: weekStart.year, month: weekStart.month, day: weekStart.day } });
    return;
  }
  router.push({ name: 'calendar', params: { year: today.year, month: today.month, day: today.day } });
}

function capitalized(str: string): string {
  let result: string;
  result = str.charAt(0).toUpperCase();
  result += str.slice(1) || '';
  return result;
}

watch(view, changeView);
</script>

<template>
  <header>
    <button id="sidebar-toggle" @click="emit('sidebar-toggle')">
      <FiSidebar />
    </button>

    <!-- TODO: remove disabled -->
    <MultiToggle v-model="view" :options="views" :disabled="['Month']" name="view-selector" />

    <button id="today-btn" @click="jumpToToday">
      {{ $t('todayBtn') }}
    </button>

    <div id="view-nav-btns">
      <button @click="moveView(true, router)"><FiChevronLeft /></button>
      <button @click="moveView(false, router)"><FiChevronRight /></button>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;

  padding: 0.5rem 0.7rem;
  grid-area: topbar;
}

#sidebar-toggle {
  margin-right: auto;
}

#view-nav-btns {
  display: flex;

  button {
    width: 1.8rem;
    height: 1.8rem;

    padding: 7%;
    border-radius: var(--small-border-radius);
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--text-color);

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--sidebar-hover-color);
    }
  }
}
</style>
