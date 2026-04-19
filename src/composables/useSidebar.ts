import { ref, readonly } from 'vue';

const isOpen = ref(window.innerWidth >= 768); // opened on load only when desktop width

export function useSidebar() {
  return {
    isOpen: readonly(isOpen),

    open() {
      isOpen.value = true;
    },

    close() {
      isOpen.value = false;
    },

    toggle() {
      isOpen.value = !isOpen.value;
    },
  };
}
