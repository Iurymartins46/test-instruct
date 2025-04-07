import { initContract } from '@ts-rest/core';
import { getHolidayContract } from './get-holiday.contract';
import { putHolidayContract } from './put-holiday.contract';
import { deleteHolidayContract } from './delete-holiday.contract';

const c = initContract();

export const holidayContract = c.router({
  getHoliday: getHolidayContract,
  putHoliday: putHolidayContract,
  deleteHoliday: deleteHolidayContract,
});
