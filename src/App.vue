<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <NavBar />
  <SideBar />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  grid-area: main;
}
</style>
