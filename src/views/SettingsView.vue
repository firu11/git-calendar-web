<script setup lang="ts">
import { useSettings } from '@/composables/useSettings';
import { useTranslation } from '@/composables/useTranslation';
import { DateTime, type WeekdayNumbers } from 'luxon';
import { LANGUAGES } from '@/constants.ts';

const { settings } = useSettings();
const { dayNameLong } = useTranslation();
</script>

<template>
  <form>
    <RouterLink to="/">&lt; Back to calendar</RouterLink>
    <label
      >{{ $t('settings.language') }}:
      <select v-model="settings.language">
        <option v-for="lang in LANGUAGES" :key="lang.code" :value="lang.code">
          {{ lang.label }}
        </option>
      </select>
    </label>
    <label>
      {{ $t('settings.timeFormat') }}:
      <select name="time-format" v-model="settings.timeFormat">
        <option value="h12">{{ $t('settings.12hourFormat') }}</option>
        <option value="h24">{{ $t('settings.24hourFormat') }}</option>
      </select>
    </label>
    <label>
      {{ $t('settings.weekStart') }}:
      <select name="week-start" v-model="settings.weekStart">
        <option v-for="i in 7" :key="i" :value="i">
          {{ dayNameLong(DateTime.now().set({ weekday: i as WeekdayNumbers })) }}
        </option>
      </select>
    </label>
    <label>
      {{ $t('settings.themes.theme') }}:
      <select name="theme" v-model="settings.theme">
        <option value="auto">{{ $t('settings.themes.auto') }}</option>
        <option value="light">{{ $t('settings.themes.light') }}</option>
        <option value="dark">{{ $t('settings.themes.dark') }}</option>
      </select>
    </label>
  </form>
</template>

<style scoped>
form {
  padding: 2rem;
  display: grid;
  gap: 1rem;
}

option {
  span {
    color: red;
  }
}
</style>
