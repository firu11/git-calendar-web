import type { CalendarEvent } from '../types/core';

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

function call(method: string, args: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    const id = idCounter++;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, method, args });
  });
}

// singleton object
export const CalendarCore = {
  addEvent: (event: CalendarEvent) => call('addEvent', [event]),
  updateEvent: (event: CalendarEvent) => call('updateEvent', [event]),
  removeEvent: (event: CalendarEvent) => call('removeEvent', [event]),
  getEvent: (id: number) => call('getEvent', [id]),
  getEvents: (from: number, to: number) => call('getEvents', [from, to]),
  setCorsProxy: (proxy: string) => call('setCorsProxy', [proxy]),
  clone: (url: string) => call('clone', [url]),
};
