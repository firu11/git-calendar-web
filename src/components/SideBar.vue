<script setup lang="ts"></script>

<template>
  <aside>
    <slot />
    <div id="links">
      <RouterLink to="/settings">settings</RouterLink>
      <RouterLink to="/test">git testing</RouterLink>
    </div>
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

#links {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 2rem;
}
</style>
