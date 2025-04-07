import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MunicipalityService } from 'src/municipality/service/municipality.service';
import { isStateCode } from 'src/utils/ibge-code';
import { dateIsMovableHoliday } from '../../utils/calculate-movable-holidays';
import { HolidayRepositoryInterface } from '../repositories/holiday-repository.interface';
import { Holiday } from '../repositories/entities/holiday.entity';

@Injectable()
export class HolidayService {
  constructor(
    @Inject('HolidayRepositoryInterface')
    private readonly holidayRepository: HolidayRepositoryInterface,
    private readonly municipalityService: MunicipalityService,
  ) {}

  private async validateCodeIbge(codeIbge: string): Promise<void> {
    if (!(await this.municipalityService.codeIbgeExists(codeIbge))) {
      throw new NotFoundException(
        'Codigo ibge não encontrado, informe um codigo ibge válido para o municipio ou estado',
      );
    }
  }

  private async getStateHoliday(
    codeIbge: string,
    dateMonthDay: string,
  ): Promise<Holiday> {
    const holiday = await this.holidayRepository.getStateHoliday(
      codeIbge,
      dateMonthDay,
    );
    if (!holiday) {
      throw new NotFoundException(
        'Feriado estadual não encontrado para a data',
      );
    }
    return holiday;
  }

  private async getMunicipalHoliday(
    codeIbge: string,
    date: string,
    dateMonthDay: string,
  ): Promise<Holiday> {
    const movableHoliday = dateIsMovableHoliday(date);

    if (movableHoliday) {
      const holiday = await this.holidayRepository.getMovableHoliday(
        codeIbge,
        movableHoliday,
      );
      if (holiday) {
        return holiday;
      }
    }

    const codeIbgeState = codeIbge.slice(0, 2);
    const holiday =
      (await this.holidayRepository.getNationalHoliday(dateMonthDay)) ??
      (await this.holidayRepository.getStateHoliday(
        codeIbgeState,
        dateMonthDay,
      )) ??
      (await this.holidayRepository.getMunicipalHoliday(
        codeIbge,
        dateMonthDay,
      ));

    if (!holiday) {
      throw new NotFoundException('Feriado municipal não encontrado para a data');
    }
    return holiday;
  }

  async getHoliday(codeIbge: string, date: string): Promise<Holiday> {
    await this.validateCodeIbge(codeIbge);

    const [, month, day] = date.split('-');
    const dateMonthDay = `${month}-${day}`;

    if (isStateCode(codeIbge)) {
      return await this.getStateHoliday(codeIbge, dateMonthDay);
    }
    return await this.getMunicipalHoliday(codeIbge, date, dateMonthDay);
  }
}
