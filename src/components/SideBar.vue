<script setup lang="ts"></script>

<template>
  <aside>
    <slot />
    <div id="links">
      <router-link to="/settings">settings</router-link>
      <router-link to="/test">git testing</router-link>
    </div>
  </aside>
</template>

<style scoped>
aside {
  grid-area: sidebar;
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
