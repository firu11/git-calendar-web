import { ref, readonly } from 'vue';

const isOpen = ref(false);

export function useCalendarModal() {
  return {
    isOpen: readonly(isOpen),

    open() {
      isOpen.value = true;
    },

    close() {
      isOpen.value = false;
    },
  };
}
