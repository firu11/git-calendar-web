import { createRouter, createWebHistory } from 'vue-router';
import WeekView from '@/components/WeekView.vue';
import TestWasm from '@/views/TestWasm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: WeekView },
    { path: '/test', component: TestWasm },
  ],
});

export default router;
