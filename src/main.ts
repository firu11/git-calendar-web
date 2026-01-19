import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import '@/assets/styles.css';
import { CalendarCore } from './wasm/core-wrapper.ts';
import '@/composables/useSettings'; // init settings

await CalendarCore.setCorsProxy('http://localhost:8000');

const app = createApp(App);
app.use(router);
app.mount('#app');
