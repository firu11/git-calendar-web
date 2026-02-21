import { DateTime } from 'luxon';

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  location?: string;
  from: DateTime;
  to: DateTime;
}

// A interface showing all the methods of CalendarCore.
// The response types are all made async (Promise<T>) using Asyncify type.
export interface CalendarApi {
  initialize(): void;
  clone(url: string): void;
  delete(): void;

  setCorsProxy(proxy: string): void;

  createEvent(event: CalendarEvent): CalendarEvent;
  updateEvent(event: CalendarEvent): CalendarEvent;
  removeEvent(event: CalendarEvent): void;

  getEvent(id: string): CalendarEvent;
  getEvents(from: DateTime, to: DateTime): CalendarEvent[];
}
