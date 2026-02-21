import { onMounted } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import router from '@/router';
import { moveView } from '@/utils';
import { DateTime } from 'luxon';

export function useKeyboard() {
  function inputNeededElsewhere(): boolean {
    return document.activeElement!.matches(
      'input, textarea, select, [contenteditable], button, [role="textbox"], [role="combobox"]',
    );
  }

  // after mounted/ready cuz of router
  onMounted(() => {
    // T -> go to today
    onKeyStroke('t', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      const today = DateTime.now();
      router.replace({ params: { year: today.year, month: today.month, day: today.day } });
    });

    // W -> switch to week view
    onKeyStroke('w', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      router.replace({ params: { view: 'week' } });
    });

    // M -> switch to month view
    onKeyStroke('m', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      router.replace({ params: { view: 'month' } });
    });

    // move view back
    onKeyStroke('ArrowLeft', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      moveView(true, router);
    });

    // move view forward
    onKeyStroke('ArrowRight', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      moveView(false, router);
    });
  });
}
