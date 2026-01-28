// https://vue-i18n.intlify.dev/

import { watch } from 'vue';
import { createI18n } from 'vue-i18n';
import type { languages } from '@/constants.ts';
import { useSettings } from '@/composables/useSettings.ts'; // init settings
import { DateTime } from 'luxon';

const { settings } = useSettings();
type LocaleCode = (typeof languages)[number]['code'];
type MessageSchema = typeof import('@/assets/locales/en.json'); // type-define 'en' as the master schema for the resource

const localeModules = import.meta.glob('@/assets/locales/*.json', { eager: true });
const messages = {} as Record<LocaleCode, MessageSchema>;
for (const path in localeModules) {
  const match = path.match(/\/([a-z]{2})\.json$/); // extract 'en', 'cs', etc.
  if (!match) continue;
  const code = match[1] as LocaleCode;
  messages[code] = (localeModules[path] as any).default; // cast JSON to correct schema
}

const i18n = createI18n<[MessageSchema], LocaleCode>({
  legacy: false,
  locale: settings.value.language,
  fallbackLocale: 'en',
  messages,
});

watch(
  () => settings.value.language,
  (newLang) => {
    i18n.global.locale = newLang;
  },
);

function dayName(date: DateTime): string {
  return date.setLocale(settings.value.language).toLocaleString({ weekday: 'short' }).toLowerCase();
}

export function useTranslation() {
  return { i18n, dayName };
}
