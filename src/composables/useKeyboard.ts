import { onMounted } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import router from '@/router';
import { getWeekAlignedRedirect, moveView } from '@/utils';
import { DateTime } from 'luxon';
import { useEventModal } from '@/composables/useEventModal';
import { useCalendarModal } from '@/composables/useCalendarModal';
import { useStrategyModal } from '@/composables/useStrategyModal';

export function useKeyboard() {
  function inputNeededElsewhere(): boolean {
    return document.activeElement!.matches(
      'input:not([type="radio"]), textarea, select, [contenteditable], button, [role="textbox"], [role="combobox"]',
    );
  }

  // after mounted/ready cuz of router
  onMounted(() => {
    // T -> go to today
    onKeyStroke('t', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();

      router.replace(getWeekAlignedRedirect(DateTime.now()));
    });

    // 4 -> switch to 4days view
    onKeyStroke('4', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      router.replace({ params: { view: '4days' } });
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

    // < -> move view back
    onKeyStroke('ArrowLeft', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      moveView(true, router);
    });

    // > -> move view forward
    onKeyStroke('ArrowRight', (e) => {
      if (inputNeededElsewhere()) return;
      e.preventDefault();
      moveView(false, router);
    });

    // ESC -> close modal
    onKeyStroke('Escape', (e) => {
      e.preventDefault();

      const calendarModal = useCalendarModal();
      const eventModal = useEventModal();
      const strategyModal = useStrategyModal();

      if (calendarModal.isOpen.value) {
        calendarModal.close();
      } else if (eventModal.isOpen.value && !strategyModal.isOpen.value) {
        eventModal.close();
      } else if (eventModal.isOpen.value && strategyModal.isOpen.value) {
        strategyModal.close();
      }
    });
  });
}
