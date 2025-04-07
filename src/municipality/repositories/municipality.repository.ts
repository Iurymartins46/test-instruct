import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipality } from './entities/municipality.entity';
import { MunicipalityRepositoryInterface } from './municipality-repository.interface';

@Injectable()
export class MunicipalityRepository implements MunicipalityRepositoryInterface {
  constructor(
    @InjectRepository(Municipality)
    private readonly repository: Repository<Municipality>,
  ) {}

  async getByCodeIbge(
    code_ibge_municipality: string,
  ): Promise<Municipality | null> {
    return await this.repository.findOne({
      where: {
        code_ibge: code_ibge_municipality,
      },
    });
  }

  async getByPrefixUf(code_ibge_state: string): Promise<Municipality[]> {
    return await this.repository.find({
      where: {
        prefix_uf: code_ibge_state,
      },
    });
  }
}
