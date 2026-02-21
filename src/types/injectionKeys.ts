import type { CalendarEvent } from '@/types/core';
import { type InjectionKey } from 'vue';

type showEventModalFunction = (event?: CalendarEvent) => void;
export const showEventModalKey: InjectionKey<showEventModalFunction> = Symbol('showEventodal');
