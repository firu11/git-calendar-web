import { DateTime } from 'luxon';
import { type RouteParamsGeneric } from 'vue-router';

export function getCurrentViewDatetime(params: RouteParamsGeneric) {
  const today = DateTime.now();

  if (!params) return today;

  let year = Number(params.year);
  let month = Number(params.month);
  let day = Number(params.day);

  if (Number.isNaN(year)) year = today.year;
  if (Number.isNaN(month)) month = today.month;
  if (Number.isNaN(day)) day = today.day;

  return DateTime.fromObject({ year: year, month: month, day: day });
}
