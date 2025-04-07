import { Holiday } from './entities/holiday.entity';
import { MovableHoliday } from 'src/utils/enums/movable-holiday.enum';

export interface HolidayRepositoryInterface {
  create(holiday: Partial<Holiday>): Promise<Holiday>;

  update(id: number, holiday: Partial<Holiday>): Promise<void>;

  delete(id: number): Promise<void>;

  getMunicipalHoliday(code_ibge: string, date: string): Promise<Holiday | null>;

  getStateHoliday(code_ibge: string, date: string): Promise<Holiday | null>;

  getStateHolidaysByDate(date: string): Promise<Holiday[]>;

  getNationalHoliday(date: string): Promise<Holiday | null>;

  getMovableHoliday(
    code_ibge: string,
    movableHoliday: MovableHoliday,
  ): Promise<Holiday | null>;
}
