<script setup lang="ts">
import { DateTime } from 'luxon';

const today = DateTime.now();
</script>

<template>
  <header>
    <slot />
    <div id="view-btns">
      <router-link :to="{ name: 'calendar', params: { year: today.year, month: today.month, day: today.day } }"
        >Today</router-link
      >
      <router-link :to="{ name: 'calendar', params: { view: '4days' } }">4 Days</router-link>
      <router-link :to="{ name: 'calendar', params: { view: 'week' } }">Week</router-link>
      <router-link :to="{ name: 'calendar', params: { view: 'month' } }">Month</router-link>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;

  padding: 0.5rem;
  grid-area: topbar;
}

#view-btns {
  display: flex;
  gap: 0.5rem;
}
</style>
