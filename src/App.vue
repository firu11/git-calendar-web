<script setup lang="ts">
import { CalendarCore } from './wasm/core-wrapper';
</script>

<template>
  <h1>Git Calendar Web</h1>
  <button @click="CalendarCore.clone('https://github.com/firu11/personal-web')">Clone</button>
  <button @click="CalendarCore.addEvent({ id: 1, from: 1, to: 2, title: 'Meeting', location: '' })">
    Add Event
  </button>
</template>

<style scoped></style>
