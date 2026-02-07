import { DateTime } from 'luxon';
import { type RouteParamsGeneric, type Router } from 'vue-router';

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

export function moveView(back: boolean, router: Router) {
  const currentDatetime = getCurrentViewDatetime(router.currentRoute.value.params);
  const sign = back ? -1 : 1;

  switch (router.currentRoute.value.params.view) {
    case 'month':
    case 'week':
      const newDate = currentDatetime.plus({ days: 7 * sign });
      router.replace({ name: 'calendar', params: { year: newDate.year, month: newDate.month, day: newDate.day } });
    case '4days':
  }
}
