export const formatLongDate = (value: string) =>
  new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));

export const formatMonthDay = (value?: string, emptyLabel = 'Sin fecha') =>
  value
    ? new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
      }).format(new Date(value))
    : emptyLabel;

export const getDateKey = (value?: string) => (value ? value.slice(0, 10) : '');

export const addDaysToDateKey = (dateKey: string, days: number) => {
  const nextDate = new Date(`${dateKey}T12:00:00`);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
};

export const formatDateKeyMonthLabel = (dateKey: string) =>
  new Intl.DateTimeFormat('es-ES', {
    month: 'short',
  })
    .format(new Date(`${dateKey}T12:00:00`))
    .replace('.', '');

export const formatDateKeyDayLabel = (dateKey: string) =>
  new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
  }).format(new Date(`${dateKey}T12:00:00`));

export const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const getNowIso = () => new Date().toISOString();

export const getTodayDateInput = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
};
