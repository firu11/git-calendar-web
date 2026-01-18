import type { CalendarEvent } from '@/types/core';

const worker = new Worker(new URL('worker.ts', import.meta.url), { type: 'module' });

let idCounter = 0;
const pending = new Map<number, { resolve: any; reject: any }>();

worker.onmessage = (e: MessageEvent) => {
  const { id, result, error } = e.data;
  const handlers = pending.get(id);
  if (!handlers) return;
  pending.delete(id);
  if (error) handlers.reject(new Error(error));
  else handlers.resolve(result);
};

function call<T>(method: string, args: any[] = []): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = idCounter++;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, method, args });
  });
}

// singleton object
export const CalendarCore = {
  initialize: (): Promise<void> => call<void>('initialize'),
  clone: (url: string): Promise<void> => call<void>('clone', [url]),
  delete: (): Promise<void> => call<void>('delete'),

  setCorsProxy: (proxy: string): Promise<boolean> => call<boolean>('setCorsProxy', [proxy]),

  addEvent: (event: CalendarEvent): Promise<void> => call<void>('addEvent', [event]),
  updateEvent: (event: CalendarEvent): Promise<void> => call<void>('updateEvent', [event]),
  removeEvent: (event: CalendarEvent): Promise<void> => call<void>('removeEvent', [event]),
  getEvent: (id: number): Promise<CalendarEvent> => call<CalendarEvent>('getEvent', [id]),
  getEvents: (from: number, to: number): Promise<CalendarEvent[]> => call<CalendarEvent[]>('getEvents', [from, to]),
};
