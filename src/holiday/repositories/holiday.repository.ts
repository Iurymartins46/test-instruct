import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Holiday } from './entities/holiday.entity';
import { HolidayRepositoryInterface } from './holiday-repository.interface';
import { HolidayType } from 'src/utils/enums/holiday-type.enum';
import { MovableHoliday } from 'src/utils/enums/movable-holiday.enum';

@Injectable()
export class HolidayRepository implements HolidayRepositoryInterface {
  constructor(
    @InjectRepository(Holiday)
    private readonly repository: Repository<Holiday>,
  ) {}

  async create(holiday: Partial<Holiday>): Promise<Holiday> {
    return await this.repository.save(holiday);
  }

  async update(id: number, holiday: Partial<Holiday>): Promise<void> {
    await this.repository.update(id, holiday);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getMunicipalHoliday(
    code_ibge: string,
    date: string,
  ): Promise<Holiday | null> {
    return await this.repository.findOne({
      where: {
        holiday_type: HolidayType.MUNICIPAL,
        date_month_day: date,
        municipality: { code_ibge },
      },
      relations: ['municipality'],
    });
  }

  async getStateHoliday(
    code_ibge: string,
    date: string,
  ): Promise<Holiday | null> {
    return await this.repository.findOne({
      where: {
        holiday_type: HolidayType.STATE,
        date_month_day: date,
        prefix_uf: code_ibge,
      },
    });
  }

  async getStateHolidaysByDate(date: string): Promise<Holiday[]> {
    return await this.repository.find({
      where: {
        holiday_type: HolidayType.STATE,
        date_month_day: date,
        prefix_uf: Not(IsNull()),
      },
    });
  }

  async getNationalHoliday(date: string): Promise<Holiday | null> {
    return await this.repository.findOne({
      where: {
        holiday_type: HolidayType.NATIONAL,
        date_month_day: date,
      },
    });
  }

  async getMovableHoliday(
    code_ibge: string,
    movableHoliday: MovableHoliday,
  ): Promise<Holiday | null> {
    return await this.repository.findOne({
      where: {
        holiday_type: HolidayType.MUNICIPAL,
        movable_holiday: movableHoliday,
        municipality: { code_ibge },
      },
      relations: ['municipality'],
    });
  }
}
