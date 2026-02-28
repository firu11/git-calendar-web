<script setup lang="ts">
import { FiSettings, FiGithub } from 'vue-icons-plus/fi';
import { useSlots } from 'vue';

const slots = useSlots();
</script>

<template>
  <aside>
    <template v-if="slots.default">
      <template v-for="(vnode, index) in slots.default()" :key="index">
        <component :is="vnode" />
        <hr v-if="index < slots.default().length - 1" />
      </template>
    </template>

    <div id="links">
      <router-link to="/settings">
        <FiSettings />
      </router-link>
      <a href="https://github.com/firu11/git-calendar-web" target="_blank">
        <FiGithub />
      </a>
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
  align-items: center;
  gap: 0.5rem;

  position: absolute;
  bottom: 0.8rem;

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;

    border-radius: var(--small-border-radius);

    &:hover {
      background-color: var(--sidebar-hover-color);
    }
  }
}

hr {
  width: 98%;
  border: 0.5px solid white;
  opacity: 0.2;
  margin: 1rem 0;
}
</style>
