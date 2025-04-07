import { Inject, Injectable } from '@nestjs/common';
import { isStateCode, isMunicipalityCode } from '../../utils/ibge-code';
import { MunicipalityRepositoryInterface } from '../repositories/municipality-repository.interface';
import { MunicipalityRepository } from '../repositories/municipality.repository';
import { Municipality } from '../repositories/entities/municipality.entity';

/**
 * export class HolidayService {
  private holidayRepository: HolidayRepositoryInterface;
  constructor(
    private readonly holidayRepositoryImplement: HolidayRepository,
    private readonly municipalityService: MunicipalityService,
  ) {
    this.holidayRepository = holidayRepositoryImplement;
  }
 */

@Injectable()
export class MunicipalityService {
  constructor(
    @Inject('MunicipalityRepositoryInterface')
    private readonly municipalityRepository: MunicipalityRepositoryInterface,
  ) {}

  async codeIbgeExists(codeIbge: string): Promise<boolean> {
    if (isStateCode(codeIbge)) {
      return Boolean(await this.municipalityRepository.getByPrefixUf(codeIbge));
    }
    if (isMunicipalityCode(codeIbge)) {
      return Boolean(await this.municipalityRepository.getByCodeIbge(codeIbge));
    }
    return false;
  }

  async getMunicipality(codeIbge: string): Promise<Municipality | null> {
    return this.municipalityRepository.getByCodeIbge(codeIbge);
  }
}
