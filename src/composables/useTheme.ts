import { ref } from 'vue';

const STORAGE_KEY = 'git-calendar-theme';

export function useTheme() {
  const themes = ['auto', 'dark', 'light'];
  const theme = ref('light');

  function getSystemPreference() {
    const name = window.matchMedia('(prefers-color-scheme: dark)').matches ? themes[1] : themes[2];
    return name!;
  }

  function applyTheme(newTheme: string, system = false) {
    theme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    if (!system) {
      localStorage.setItem(STORAGE_KEY, newTheme);
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved != themes[0]) {
      applyTheme(saved);
    } else {
      applyTheme(getSystemPreference(), true);
    }
  }

  return { theme, initTheme, themes };
}
