<script setup lang="ts">
import { CalendarCore } from '@/wasm/core-wrapper';
import { onMounted } from 'vue';

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
</script>

<template>
  <div class="container">
    <span>Git Testing:</span>
    <div id="git-testing-btns">
      <button @click="CalendarCore.createCalendar('Main')">Create Main cal</button>
      <button @click="CalendarCore.removeCalendar('Main')">Delete Main cal</button>
      <button @click="CalendarCore.cloneCalendar('personal-web', 'https://github.com/firu11/personal-web')">
        Clone
      </button>
      <br />
    </div>
  </div>
</template>

<style scoped>
#git-testing-btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;

  button {
    background-color: color-mix(in srgb, var(--btn-bg-color), white 5%);
    &:hover {
      background-color: color-mix(in srgb, var(--btn-bg-color-hover), white 5%);
    }
  }
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
