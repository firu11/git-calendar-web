import { onMounted } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import router from '@/router';
import { moveView } from '@/utils';
import { DateTime } from 'luxon';

export function useKeyboard() {
  // after mounted/ready cuz of router
  onMounted(() => {
    // T -> go to today
    onKeyStroke('t', (e) => {
      e.preventDefault();
      const today = DateTime.now();
      router.replace({ params: { year: today.year, month: today.month, day: today.day } });
    });

    // W -> switch to week view
    onKeyStroke('w', (e) => {
      e.preventDefault();
      router.replace({ params: { view: 'week' } });
    });

    // M -> switch to month view
    onKeyStroke('m', (e) => {
      e.preventDefault();
      router.replace({ params: { view: 'month' } });
    });

    // move view back
    onKeyStroke('ArrowLeft', (e) => {
      e.preventDefault();
      moveView(true, router);
    });

    // move view forward
    onKeyStroke('ArrowRight', (e) => {
      e.preventDefault();
      moveView(false, router);
    });
  });
}
