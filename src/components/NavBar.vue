<script setup lang="ts"></script>

<template>
  <header>
    <span>Git Calendar Web</span>
    <span style="display: flex; gap: 0.5em">
      <RouterLink to="/">calendar</RouterLink>
      <RouterLink to="/settings">settings</RouterLink>
      <RouterLink to="/test">git testing</RouterLink>
    </span>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem;
  background-color: var(--navbar-color);

  span:first-of-type {
    font-size: 1.3rem;
  }
}
</style>
