<script setup lang="ts">
import { getCurrentViewDatetime } from '@/utils';
import { DateTime } from 'luxon';
import { FiChevronLeft, FiChevronRight } from 'vue-icons-plus/fi';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const today = DateTime.now();

function move(back: boolean) {
  const currentDatetime = getCurrentViewDatetime(route.params);
  const sign = back ? -1 : 1;

  switch (route.params.view) {
    case 'month':
    case 'week':
      const newDate = currentDatetime.plus({ days: 7 * sign });
      router.replace({ name: 'calendar', params: { year: newDate.year, month: newDate.month, day: newDate.day } });
    case '4days':
  }
}
</script>

<template>
  <header>
    <slot />
    <div id="view-btns">
      <router-link :to="{ name: 'calendar', params: { year: today.year, month: today.month, day: today.day } }">
        Today
      </router-link>
      <router-link :to="{ name: 'calendar', params: { view: '4days' } }" :class="{ disabled: true }">
        4 Days
      </router-link>
      <router-link :to="{ name: 'calendar', params: { view: 'week' } }">Week</router-link>
      <router-link :to="{ name: 'calendar', params: { view: 'month' } }" :class="{ disabled: true }">Month</router-link>
    </div>
    <div id="view-nav-btns">
      <button @click="move(true)"><FiChevronLeft /></button>
      <button @click="move(false)"><FiChevronRight /></button>
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

#view-btns {
  display: flex;
  gap: 0.5rem;

  > .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

#view-nav-btns {
  display: flex;

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
</style>
