<script setup lang="ts">
import { CalendarCore } from '@/wasm/core-wrapper';
import { onMounted } from 'vue';
import { DateTime } from 'luxon';

onMounted(async () => {
  // const uid = uuidv4();
  // // await CalendarCore.createEvent({
  // //   id: uid,
  // //   from: DateTime.now(),
  // //   to: DateTime.now().plus({ hour: 2 }),
  // //   title: 'Meeting',
  // //   location: '',
  // // });
  // let e: CalendarEvent = await CalendarCore.getEvent(uid);
  // console.log(e.from.hour);
});

async function createEventAndLogIt() {
  const newEvent = await CalendarCore.createEvent({
    from: DateTime.now(),
    to: DateTime.now().plus({ hour: 2 }),
    title: 'Meeting',
  });

  console.log('created an event:', newEvent);
}
</script>

<template>
  <div class="container">
    <span>Git Testing:</span>
    <div id="git-testing-btns">
      <button @click="CalendarCore.initialize()">Init</button>
      <button @click="CalendarCore.delete()">Delete</button>
      <button @click="CalendarCore.clone('https://github.com/firu11/personal-web')">Clone</button>
      <br />
      <button @click="createEventAndLogIt()">Create Event</button>
    </div>
  </div>
</template>

<style scoped>
#git-testing-btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  align-items: center;

  > span {
    font-weight: 500;
  }
}
</style>
