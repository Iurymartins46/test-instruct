import { MovableHoliday } from './enums/movable-holiday.enum';

function calculateEasterHolidayDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() - days);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function calculateCarnivalHolidayDate(year: number): Date {
  const easter = calculateEasterHolidayDate(year);
  return subtractDays(easter, 47);
}

function calculateGoodFridayHolidayDate(year: number): Date {
  const easter = calculateEasterHolidayDate(year);
  return subtractDays(easter, 2);
}

function calculateCorpusChristiHolidayDate(year: number): Date {
  const easter = calculateEasterHolidayDate(year);
  return addDays(easter, 60);
}

export function dateIsMovableHoliday(date: string): MovableHoliday | null {
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));

  const carnivalDate = calculateCarnivalHolidayDate(year);
  const goodFridayDate = calculateGoodFridayHolidayDate(year);
  const easterDate = calculateEasterHolidayDate(year);
  const corpusChristiDate = calculateCorpusChristiHolidayDate(year);

  if (dateObj.getTime() === carnivalDate.getTime()) {
    return MovableHoliday.CARNAVAL;
  } else if (dateObj.getTime() === goodFridayDate.getTime()) {
    return MovableHoliday.SEXTA_FEIRA_SANTA;
  } else if (dateObj.getTime() === easterDate.getTime()) {
    return MovableHoliday.PASCOA;
  } else if (dateObj.getTime() === corpusChristiDate.getTime()) {
    return MovableHoliday.CORPUS_CHRISTI;
  }

  return null;
}

export function parseMovableHoliday(value: string): MovableHoliday | null {
  return Object.values(MovableHoliday).includes(value as MovableHoliday)
    ? (value as MovableHoliday)
    : null;
}
