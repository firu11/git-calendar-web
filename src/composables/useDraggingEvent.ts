import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type { CalendarEvent } from '@/types/core.ts';
import { DateTime } from 'luxon';
import { useMouse } from '@vueuse/core';
import { numberOfHours, timeRangeFormat } from '@/utils';
import { useSettings } from '@/composables/useSettings';
import { useEventModal } from '@/composables/useEventModal';

export function useDraggingEvent(timelineRef: Ref<HTMLElement | null>, date: Ref<DateTime>) {
  const { y } = useMouse();
  const { settings } = useSettings();
  const eventModal = useEventModal();

  const drag = ref({ active: false, startY: 0 });
  let holdTimeout: number | null = null;

  const snapToGridHeight = computed(() => {
    if (!timelineRef.value) return 0;
    return timelineRef.value.clientHeight / numberOfHours() / (60 / settings.value.dragPrecisionMinutes);
  });

  const snappedHeight = computed(() => {
    if (!timelineRef.value) return 0;
    let rawHeight = y.value - timelineRef.value.getBoundingClientRect().y - drag.value.startY;
    rawHeight = Math.max(snapToGridHeight.value, rawHeight);
    return Math.round(rawHeight / snapToGridHeight.value) * snapToGridHeight.value;
  });

  const placeholderHeight = computed(() => `${snappedHeight.value}px`);

  const placeholderSubtitle = computed(() => {
    const [startTime, endTime] = getEventTimes();
    return timeRangeFormat(startTime, endTime);
  });

  function getEventTimes(): [DateTime, DateTime] {
    if (!timelineRef.value) return [date.value, date.value];

    // number of 30min slots from top
    const startSlots = Math.round(drag.value.startY / snapToGridHeight.value);
    const durationSlots = Math.round(snappedHeight.value / snapToGridHeight.value);
    const endSlots = startSlots + durationSlots;

    const startTotalMinutes = startSlots * settings.value.dragPrecisionMinutes;
    const endTotalMinutes = endSlots * settings.value.dragPrecisionMinutes;

    const startTime = date.value
      .set({ hour: settings.value.dayViewStartHour, minute: 0 })
      .plus({ minutes: startTotalMinutes });

    const endTime = date.value
      .set({ hour: settings.value.dayViewStartHour, minute: 0 })
      .plus({ minutes: endTotalMinutes });

    return [startTime, endTime];
  }

  function startDragging(_: PointerEvent) {
    drag.value.active = true;
    const gridHeight = timelineRef.value!.clientHeight / numberOfHours() / 2;

    let startY = y.value - timelineRef.value!.getBoundingClientRect().y;
    startY = Math.max(0, startY);
    startY = Math.floor(startY / gridHeight) * gridHeight;

    drag.value.startY = startY;

    window.addEventListener('pointerup', dragStop); // listen for stop
  }

  function cancelHold() {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }
    window.removeEventListener('pointerup', cancelHold);
    window.removeEventListener('pointermove', cancelHold);
  }

  function dragStart(e: PointerEvent) {
    if (drag.value.active) return; // already dragging

    const targetClasses = (e.target as Element).classList;
    const isValidTarget =
      targetClasses.contains('timeline-group') ||
      targetClasses.contains('timeline-grid') ||
      targetClasses.contains('day-timeline');

    if (!isValidTarget) return;

    if (e.pointerType === 'touch') {
      e.preventDefault();
      holdTimeout = window.setTimeout(() => startDragging(e), 100);
      window.addEventListener('pointerup', cancelHold);
      window.addEventListener('pointermove', cancelHold);
    } else {
      startDragging(e); // mouse = immediate
    }
  }

  function dragStop(_: PointerEvent) {
    if (!drag.value.active) return; // not dragging

    drag.value.active = false;

    const [startTime, endTime] = getEventTimes();
    const event: CalendarEvent = { title: '', from: startTime, to: endTime, calendar: 'main', tag: '' }; // main as the default
    eventModal.open(event);

    window.removeEventListener('pointerup', dragStop); // cleanup
  }

  return {
    drag,
    placeholderHeight,
    placeholderSubtitle,
    dragStart,
  };
}
