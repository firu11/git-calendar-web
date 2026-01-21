<script setup lang="ts">
import { CalendarCore } from '@/wasm/core-wrapper';
import { onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

onMounted(async () => {
  // let e: CalendarEvent = await CalendarCore.getEvent(1);
});
</script>

<template>
  <button @click="CalendarCore.initialize()">Init</button>
  <button @click="CalendarCore.delete()">Delete</button>
  <button @click="CalendarCore.clone('https://github.com/firu11/personal-web')">Clone</button>
  <button
    @click="
      CalendarCore.addEvent({
        id: uuidv4(),
        from: DateTime.now(),
        to: DateTime.now().plus({ hour: 2 }),
        title: 'Meeting',
        location: '',
      })
    "
  >
    Add Event
  </button>
</template>

<style scoped></style>
