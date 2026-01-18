import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import { useTheme } from '@/composables/useTheme';
import '@/assets/styles.css';
import { CalendarCore } from './wasm/core-wrapper.ts';

const { initTheme } = useTheme();
initTheme();

await CalendarCore.setCorsProxy('http://localhost:8000');

const app = createApp(App);
app.use(router);
app.mount('#app');
