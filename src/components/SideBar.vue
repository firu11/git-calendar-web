<script setup lang="ts"></script>

<template>
  <aside>
    <slot />
  </aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.5rem;

  background-color: var(--sidebar-color);
}
</style>
