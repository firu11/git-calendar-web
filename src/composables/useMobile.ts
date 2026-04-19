import { onMounted, onUnmounted, ref } from 'vue';

export function useMobile() {
  const matches = ref(false);
  const media = window.matchMedia('(max-width: 767px)');

  const update = () => (matches.value = media.matches);

  onMounted(() => {
    update();
    media.addEventListener('change', update);
  });

  onUnmounted(() => {
    media.removeEventListener('change', update);
  });

  return matches;
}
