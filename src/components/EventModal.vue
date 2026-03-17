<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { type CalendarEvent } from '@/types/core';
import { DateTime } from 'luxon';
import { CalendarCore } from '@/wasm/core-wrapper';
import { useEventModal } from '@/composables/useEventModal';

const emit = defineEmits(['refresh-data']);
const thisModal = useEventModal();

const form = reactive({
  title: '',
  description: '',
  location: '',
  fromDate: '',
  fromTime: '',
  toDate: '',
  toTime: '',
  calendar: '',
  wholeDay: false,
});

const calendarNames = ref([] as string[]);

watch(
  () => thisModal.event,
  (newEvent) => {
    updateFormFromEvent(newEvent.value);
  },
  { immediate: true }, // fire right onMounted, not wait till first change
);

function updateFormFromEvent(event: CalendarEvent | undefined) {
  if (!event) return;

  form.title = event.title;
  form.location = event.location ?? '';
  form.description = event.description ?? '';

  form.fromDate = event.from.toISODate() ?? '';
  form.toDate = event.to.toISODate() ?? '';

  form.fromTime = event.from.toISOTime({ includeOffset: false, precision: 'minute' }) ?? '';
  form.toTime = event.to.toISOTime({ includeOffset: false, precision: 'minute' }) ?? '';

  form.calendar = event.calendar;
}

function reconstructEvent(): CalendarEvent {
  const event = {} as CalendarEvent;

  event.id = thisModal.event.value?.id;
  event.title = form.title;
  event.location = form.location;
  event.description = form.description;
  event.calendar = form.calendar;

  if (form.wholeDay) {
    event.from = DateTime.fromISO(`${form.fromDate}T00:00:00`);
    event.to = DateTime.fromISO(`${form.toDate}T23:59:00`);
  } else {
    event.from = DateTime.fromISO(`${form.fromDate}T${form.fromTime}`);
    event.to = DateTime.fromISO(`${form.toDate}T${form.toTime}`);
  }

  return event;
}

async function saveEvent() {
  const event = reconstructEvent();
  if (thisModal.isEventNew.value) {
    const e = await CalendarCore.createEvent(event);
    console.log('created event:', e);
  } else {
    const e = await CalendarCore.updateEvent(event);
    console.log('updated event:', e);
  }
  emit('refresh-data');
  thisModal.close();
}

async function deleteEvent() {
  const event = reconstructEvent();
  await CalendarCore.removeEvent(event);
  emit('refresh-data');
  thisModal.close();
}

onMounted(async () => {
  calendarNames.value = await CalendarCore.listCalendars();
});

// const exampleTags = ref(['School', 'Work', 'Birthday']); // TODO
// const selectedTags = ref<string[]>([]);
</script>

<template>
  <div id="event-modal" class="modal">
    <form>
      <input type="text" name="title" :placeholder="$t('event.title')" autocomplete="none" v-model="form.title" />

      <div class="dates">
        <span>{{ $t('event.from') }}:</span>
        <div class="datetime">
          <input type="date" name="from-date" v-model="form.fromDate" />
          <input type="time" name="from-time" v-model="form.fromTime" v-if="!form.wholeDay" />
        </div>

        <span>{{ $t('event.to') }}:</span>
        <div class="datetime">
          <input type="date" name="to-date" v-model="form.toDate" />
          <input type="time" name="to-time" v-model="form.toTime" v-if="!form.wholeDay" />
        </div>
      </div>

      <label>
        {{ $t('event.wholeDay') }}
        <input type="checkbox" v-model="form.wholeDay" />
      </label>

      <input
        type="text"
        name="location"
        :placeholder="$t('event.location')"
        autocomplete="none"
        v-model="form.location"
      />

      <select name="calendar" id="" v-model="form.calendar">
        <option v-for="calendarName in calendarNames" :value="calendarName" :key="calendarName">
          {{ calendarName }}
        </option>
      </select>

      <!--
      TODO tags and calendar select
      <div>
        <label v-for="tagName in exampleTags" :key="tagName">
          <input type="checkbox" name="idk" :value="tagName" v-model="selectedTags" />
          {{ tagName }}
        </label>
      </div>
      -->

      <textarea name="description" rows="3" :placeholder="$t('event.description')" v-model="form.description" />

      <div class="bottom-btns">
        <button type="button" @click="saveEvent">{{ $t('saveBtn') }}</button>
        <button type="button" @click="thisModal.close">{{ $t('closeBtn') }}</button>
        <button v-if="!thisModal.isEventNew.value" type="button" @click="deleteEvent" class="delete-btn">
          {{ $t('deleteBtn') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.dates {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;

  > span {
    align-self: center;
  }
}

.datetime {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.delete-btn {
  border: 1px solid var(--git-color);
  background-color: var(--btn-red-bg-color);

  &:hover:not(:focus):not(:disabled) {
    background-color: var(--btn-red-bg-color-hover);
  }
}
</style>
