import { ref, shallowRef, readonly, computed } from 'vue';
import type { CalendarEvent } from '@/types/core';

const isOpen = ref(false);
const editingEvent = shallowRef<CalendarEvent | undefined>(undefined);

export function useEventModal() {
  return {
    isOpen: readonly(isOpen),
    event: readonly(editingEvent),
    isEventNew: computed(() => editingEvent.value!.id === undefined),

    open(event?: CalendarEvent) {
      if (event) {
        editingEvent.value = event;
      } else {
        editingEvent.value = undefined;
      }

      isOpen.value = true;
    },

    close() {
      isOpen.value = false;
      editingEvent.value = undefined;
    },
  };
}
