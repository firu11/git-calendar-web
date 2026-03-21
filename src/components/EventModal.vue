<script setup lang="ts">
import { ref, reactive, watch, onMounted, toRaw } from 'vue';
import { Freq, UpdateStrategy, type CalendarEvent } from '@/types/core';
import { DateTime } from 'luxon';
import { CalendarCore } from '@/wasm/core-wrapper';
import { useEventModal } from '@/composables/useEventModal';

const repeatEndOptions = [
  { value: 'on', label: 'On' },
  { value: 'after', label: 'After' },
];
const frequencyOptions = [
  { value: null, label: 'never' },
  { value: Freq.Day, label: 'daily' },
  { value: Freq.Week, label: 'weekly' },
  { value: Freq.Month, label: 'monthly' },
  { value: Freq.Year, label: 'yearly' },
];

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
  entireDay: false,

  repeatFreq: null as Freq | null,
  repeatEnd: 'after',
  repeatEndOn: DateTime.now().plus({ week: 1 }).toISODate(),
  repeatEndAfter: 5,
});

const calendarNames = ref([] as string[]);

let originalEvent: CalendarEvent | undefined = undefined;
watch(
  () => thisModal.event,
  (newEvent) => {
    originalEvent = structuredClone(toRaw(newEvent.value)); // copy
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

  if (form.fromTime == '00:00' && form.toTime == '23:59') {
    form.entireDay = true;
    form.fromTime = '14:00'; // TODO some defaults
    form.toTime = '16:00';
  } else {
    form.entireDay = false;
  }

  if (event.repeat) {
    form.repeatFreq = event.repeat.frequency as Freq;

    if (event.repeat.count && event.repeat.count > 1) {
      form.repeatEnd = 'After';
      form.repeatEndAfter = event.repeat.count;
    } else if (event.repeat.until) {
      form.repeatEnd = 'On';
      form.repeatEndOn = event.repeat.until.toISOTime({ includeOffset: false, precision: 'minute' }) ?? '';
    } else {
      console.log('Something went wrong with the events repetition. Both Until and Count are undefined or invalid.');
    }
  }

  form.calendar = event.calendar;
}

function reconstructEvent(): CalendarEvent {
  const event = originalEvent ?? ({} as CalendarEvent);

  event.id = thisModal.event.value?.id;
  event.title = form.title;
  event.location = form.location;
  event.description = form.description;
  event.calendar = form.calendar;

  if (form.entireDay) {
    event.from = DateTime.fromISO(`${form.fromDate}T00:00`);
    event.to = DateTime.fromISO(`${form.toDate}T23:59`);
  } else {
    event.from = DateTime.fromISO(`${form.fromDate}T${form.fromTime}`);
    event.to = DateTime.fromISO(`${form.toDate}T${form.toTime}`);
  }

  if (form.repeatFreq) {
    event.repeat = {
      frequency: form.repeatFreq as Freq,
      interval: 1, // TODO
      until: form.repeatEnd == 'On' ? DateTime.fromISO(`${form.fromDate}`) : undefined,
      count: form.repeatEnd == 'After' ? form.repeatEndAfter : -1,
    };
  } else {
    event.repeat = undefined;
  }

  return event;
}

async function saveEvent(e: Event) {
  e.preventDefault();

  const event = reconstructEvent();

  let newEvent: CalendarEvent;
  try {
    if (thisModal.isEventNew.value) {
      newEvent = await CalendarCore.createEvent(event);
      console.log('created event:', newEvent);
    } else if (!event.repeat && !originalEvent?.repeat) {
      console.log(event.repeat, originalEvent?.repeat, event.masterId);
      newEvent = await CalendarCore.updateEvent(event);
      console.log('updated event:', newEvent);
    } else {
      // TODO popup with update strategy options
      newEvent = await CalendarCore.updateEventWithStrategy(event, UpdateStrategy.All);
      console.log('updated event with strategy:', newEvent);
    }
  } catch (err) {
    alert(err);
    return;
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
          <input type="time" name="from-time" v-model="form.fromTime" v-if="!form.entireDay" />
        </div>

        <span>{{ $t('event.to') }}:</span>
        <div class="datetime">
          <input type="date" name="to-date" v-model="form.toDate" />
          <input type="time" name="to-time" v-model="form.toTime" v-if="!form.entireDay" />
        </div>
      </div>

      <label>
        {{ $t('event.entireDay') }}
        <input type="checkbox" v-model="form.entireDay" />
      </label>

      <label>
        {{ $t('event.repeat.repeat') }}:
        <select name="repeat" v-model="form.repeatFreq">
          <option v-for="freq in frequencyOptions" :value="freq.value" :key="freq.label">
            {{ $t(`event.repeat.${freq.label}`) }}
          </option>
        </select>
      </label>

      <label v-if="form.repeatFreq">
        {{ $t('event.repeat.end') }}:
        <select name="end" v-model="form.repeatEnd">
          <option v-for="end in repeatEndOptions" :value="end.value" :key="end.label">
            {{ $t(`event.repeat.end${end.label}`) }}
          </option>
        </select>

        <input v-if="form.repeatEnd == 'on'" type="date" name="end-on" v-model="form.repeatEndOn" />
        <input v-if="form.repeatEnd == 'after'" type="number" name="end-after" v-model="form.repeatEndAfter" />
      </label>

      <label>
        {{ $t('event.calendar') }}:
        <select name="calendar" v-model="form.calendar">
          <option v-for="calendarName in calendarNames" :value="calendarName" :key="calendarName">
            {{ calendarName }}
          </option>
        </select>
      </label>

      <input
        type="text"
        name="location"
        :placeholder="$t('event.location')"
        autocomplete="none"
        v-model="form.location"
      />

      <!--
      TODO tags
      <div>
        <label v-for="tagName in exampleTags" :key="tagName">
          <input type="checkbox" name="idk" :value="tagName" v-model="selectedTags" />
          {{ tagName }}
        </label>
      </div>
      -->

      <textarea name="description" rows="3" :placeholder="$t('event.description')" v-model="form.description" />

      <div class="bottom-btns">
        <button type="submit" @click="saveEvent">{{ $t('saveBtn') }}</button>
        <button type="button" @click="thisModal.close">{{ $t('closeBtn') }}</button>
        <button v-if="!thisModal.isEventNew.value" type="button" @click="deleteEvent" class="delete-btn">
          {{ $t('deleteBtn') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
label:has(select[name='end']) {
  margin-left: 4.3rem;

  input[name='end-after'] {
    width: 5rem;
  }

  input[name='end-on'] {
    width: 10rem;
  }
}

label:has(select) {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  select {
    width: 100%;
  }
}

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
