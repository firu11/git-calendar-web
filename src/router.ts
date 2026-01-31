import { createRouter, createWebHistory } from 'vue-router';
import TestWasm from '@/views/TestWasm.vue';
import CalendarView from '@/views/CalendarView.vue';
import SettingsView from '@/views/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: CalendarView },
    { path: '/settings', component: SettingsView },
    { path: '/test', component: TestWasm },
  ],
});

export default router;
