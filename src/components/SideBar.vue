<script setup lang="ts">
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

hr {
  width: 98%;
  border: 0.5px solid white;
  opacity: 0.2;
  margin: 1rem 0;
}
</style>
