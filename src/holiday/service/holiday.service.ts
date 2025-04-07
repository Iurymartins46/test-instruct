import { MunicipalityService } from 'src/municipality/service/municipality.service';
import { isMunicipalityCode, isStateCode } from 'src/utils/ibge-code';
import { HolidayRepositoryInterface } from '../repositories/holiday-repository.interface';
import { Holiday } from '../repositories/entities/holiday.entity';
import { HolidayType } from '../../utils/enums/holiday-type.enum';
import { MovableHoliday, NameMovableHoliday } from 'src/utils/enums/movable-holiday.enum';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  dateIsMovableHoliday,
  parseMovableHoliday,
} from '../../utils/calculate-movable-holidays';

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
      throw new NotFoundException(
        'Feriado municipal não encontrado para a data',
      );
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

  private async createStateHoliday(
    name: string,
    codeIbge: string,
    data: string,
  ): Promise<void> {
    if (parseMovableHoliday(data)) {
      throw new BadRequestException(
        'Não é possivel cadastrar um feriado estadual movel, apenas um feriado fixo',
      );
    }
    const stateHoliday = await this.holidayRepository.getStateHoliday(
      codeIbge,
      data,
    );
    if (stateHoliday) {
      return await this.holidayRepository.update(stateHoliday.id, {
        date_month_day: data,
      });
    }
    await this.holidayRepository.create({
      name: name,
      holiday_type: HolidayType.STATE,
      date_month_day: data,
      prefix_uf: codeIbge,
    });
    return;
  }

  private async createMovableMunicipalHoliday(
    codeIbge: string,
    isMovableHoliday: MovableHoliday,
  ) {
    const name =
      NameMovableHoliday[
        isMovableHoliday
          .toUpperCase()
          .replace(/-/g, '_') as keyof typeof NameMovableHoliday
      ];
    const movableHoliday = await this.holidayRepository.getMovableHoliday(
      codeIbge,
      isMovableHoliday,
    );
    if (movableHoliday) {
      return await this.holidayRepository.update(movableHoliday.id, {
        name: name,
      });
    }
    const municipality =
      await this.municipalityService.getMunicipality(codeIbge);
    if (!municipality) {
      throw new NotFoundException(
        'Codigo ibge não encontrado, informe um codigo ibge válido para o municipio',
      );
    }
    await this.holidayRepository.create({
      name: name,
      holiday_type: HolidayType.MUNICIPAL,
      movable_holiday: isMovableHoliday,
      municipality: municipality,
    });
    return;
  }

  private async createFixedMunicipalHoliday(
    name: string,
    codeIbge: string,
    data: string,
  ) {
    const codeIbgeState = codeIbge.slice(0, 2);
    const stateHoliday = await this.holidayRepository.getStateHoliday(
      codeIbgeState,
      data,
    );
    if (stateHoliday) {
      throw new BadRequestException(
        'Já existe um feriado estadual na data informada, não é possivel cadastrar um feriado municipal',
      );
    }
    const municipalityHoliday =
      await this.holidayRepository.getMunicipalHoliday(codeIbge, data);
    if (municipalityHoliday) {
      return await this.holidayRepository.update(municipalityHoliday.id, {
        name: name,
      });
    }
    const municipality =
      await this.municipalityService.getMunicipality(codeIbge);
    if (!municipality) {
      throw new NotFoundException('Ibge code is invalid, nunca entra aqui');
    }
    await this.holidayRepository.create({
      name: name,
      holiday_type: HolidayType.MUNICIPAL,
      date_month_day: data,
      municipality: municipality,
    });
    return;
  }

  async createHoliday(
    codeIbge: string,
    data: string,
    name?: string,
  ): Promise<void> {
    await this.validateCodeIbge(codeIbge);
    if (await this.holidayRepository.getNationalHoliday(data)) {
      throw new ForbiddenException(
        'Feriado nacional existente para a data informada, não é possivel cadastrar um novo feriado nem atualizar o nome do mesmo',
      );
    }

    if (!name) {
      const isMovableHoliday = parseMovableHoliday(data);
      if (!isMovableHoliday) {
        throw new BadRequestException(
          'E preciso informar um nome para o feriado',
        );
      }
      if (isStateCode(codeIbge)) {
        throw new BadRequestException(
          'Não é possivel cadastrar um feriado movel para o estado, apenas para o municipio',
        );
      }
      return await this.createMovableMunicipalHoliday(
        codeIbge,
        isMovableHoliday,
      );
    }

    if (isStateCode(codeIbge)) {
      return await this.createStateHoliday(name, codeIbge, data);
    }
    return await this.createFixedMunicipalHoliday(name, codeIbge, data);
  }

  private async deleteStateHoliday(codeIbge: string, data: string) {
    if (parseMovableHoliday(data)) {
      throw new BadRequestException(
        'Estado não tem feriado movel, apenas feriado fixo, não é possivel deletar',
      );
    }

    if (await this.holidayRepository.getNationalHoliday(data)) {
      throw new ForbiddenException(
        'Não e possivel deletar um feriado nacional em um estado',
      );
    }
    const stateHoliday = await this.holidayRepository.getStateHoliday(
      codeIbge,
      data,
    );
    if (!stateHoliday) {
      throw new NotFoundException(
        'Não existe feriado estadual na data informada',
      );
    }
    return await this.holidayRepository.delete(stateHoliday.id);
  }

  private async deleteMunicipalHoliday(codeIbge: string, data: string) {
    const isMovableHoliday = parseMovableHoliday(data);
    if (isMovableHoliday) {
      const movableHoliday = await this.holidayRepository.getMovableHoliday(
        codeIbge,
        isMovableHoliday,
      );
      if (!movableHoliday) {
        throw new NotFoundException(
          'Não existe feriado municipal para a data informada',
        );
      }
      return await this.holidayRepository.delete(movableHoliday.id);
    }

    const codeIbgeState = codeIbge.slice(0, 2);
    const nationalOrStateHoliday =
      (await this.holidayRepository.getNationalHoliday(data)) ??
      (await this.holidayRepository.getStateHoliday(codeIbgeState, data));
    if (nationalOrStateHoliday) {
      throw new ForbiddenException(
        'Não e possivel deletar um feriado nacional ou estadual em um municipio',
      );
    }

    const municipalityHoliday =
      await this.holidayRepository.getMunicipalHoliday(codeIbge, data);
    if (!municipalityHoliday) {
      throw new NotFoundException(
        'Não existe feriado municipal para a data informada',
      );
    }
    return await this.holidayRepository.delete(municipalityHoliday.id);
  }

  async deleteHoliday(codeIbge: string, data: string): Promise<void> {
    await this.validateCodeIbge(codeIbge);

    if (isStateCode(codeIbge)) {
      return await this.deleteStateHoliday(codeIbge, data);
    }

    return await this.deleteMunicipalHoliday(codeIbge, data);
  }
}
