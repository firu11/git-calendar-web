import type { DateTime } from 'luxon';

export interface CalendarEvent {
  id: string;
  title: string;
  location: string;
  from: DateTime;
  to: DateTime;
}
