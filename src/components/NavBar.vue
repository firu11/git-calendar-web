<script setup lang="ts">
import LanguageSwitch from '@/components/LanguageSwitch.vue';
</script>

<template>
  <header>
    <span>Git Calendar Web - {{ $t('test') }}</span>
    <span style="display: flex; gap: 0.5em">
      <RouterLink to="/">calendar</RouterLink>
      <RouterLink to="/test">git testing</RouterLink>
      <LanguageSwitch />
    </span>
  </header>
</template>

<style scoped>
header {
  grid-area: navbar;

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
