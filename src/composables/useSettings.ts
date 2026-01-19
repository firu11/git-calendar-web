import { useStorage } from '@vueuse/core';
import { watch } from 'vue';
import { languages } from '@/constants.ts';

export function useSettings() {
  return { settings };
}

type Theme = 'auto' | 'light' | 'dark';
type Lang = (typeof languages)[number]['code'];

type UserSettings = {
  theme: Theme;
  language: Lang;
  dayViewStartHour: number;
  dayViewEndHour: number;
};

// default settings
const settings = useStorage<UserSettings>('user-settings', {
  theme: 'auto',
  language: 'en',
  dayViewStartHour: 6,
  dayViewEndHour: 24,
});

// -------------------------- theme --------------------------
function getSystemThemePreference() {
  const name = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return name!;
}

// auto html tag update
function applyTheme(theme: Theme) {
  if (theme === 'auto')
    document.documentElement.setAttribute('data-theme', getSystemThemePreference());
  else document.documentElement.setAttribute('data-theme', theme);
}

// run right after load
applyTheme(settings.value.theme);
// watch for changes and apply automatically
watch(
  () => settings.value.theme,
  (newTheme) => applyTheme(newTheme),
);
