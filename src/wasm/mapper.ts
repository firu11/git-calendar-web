import { DateTime } from 'luxon';

// In your hydrate function (updated version)
export function hydrateDates<T>(data: unknown): T {
  if (!data || typeof data !== 'object') return data as T;

  if (Array.isArray(data)) {
    return data.map(hydrateDates) as any;
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if ((key === 'from' || key === 'to') && typeof value === 'string') {
      const dt = DateTime.fromISO(value, {
        setZone: true, // respect & keep the timezone offset from the string
      });

      if (!dt.isValid) {
        console.warn(`Bad ISO in ${key}: ${value} → ${dt.invalidExplanation}`);
        result[key] = null; // or throw, or keep as string, etc.
      } else {
        result[key] = dt;
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = hydrateDates(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

export function dehydrateDates(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(dehydrateDates);
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof DateTime) {
      result[key] = value.toISO(); // → "2026-01-21T10:00:00.000+01:00"
      // or value.toUTC().toISO()         // if you want always UTC
      // or value.toFormat("yyyy-MM-dd'T'HH:mm:ss")  // no zone/offset
    } else if (value && typeof value === 'object') {
      result[key] = dehydrateDates(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
