<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar';
import { FiSidebar } from 'vue-icons-plus/fi';

const sidebar = useSidebar();
</script>
<template>
  <button id="sidebar-toggle" @click="sidebar.toggle">
    <FiSidebar />
  </button>
</template>
<style scoped></style>
