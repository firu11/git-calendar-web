<script setup lang="ts">
import { CalendarCore } from '@/wasm/core-wrapper';
import { onMounted } from 'vue';

onMounted(async () => {
  // let e: CalendarEvent = await CalendarCore.getEvent(1);
});
</script>

<template>
  <button @click="CalendarCore.initialize()">Init</button>
  <button @click="CalendarCore.delete()">Delete</button>
  <button @click="CalendarCore.clone('https://github.com/firu11/personal-web')">Clone</button>
  <button @click="CalendarCore.addEvent({ id: 1, from: new Date(), to: new Date(), title: 'Meeting', location: '' })">
    Add Event
  </button>
</template>

<style scoped></style>
