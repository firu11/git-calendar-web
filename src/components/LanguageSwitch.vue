<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { languages } from '@/constants.ts';
import { useSettings } from '@/composables/useSettings.ts';

const { locale } = useI18n();
const { settings } = useSettings();

watch(
  () => settings.value.language,
  (newLang: string) => {
    locale.value = newLang;
  },
);
</script>

<template>
  <select v-model="settings.language">
    <option v-for="lang in languages" :key="lang.code" :value="lang.code">
      {{ lang.label }}
    </option>
  </select>
</template>

<style scoped></style>
