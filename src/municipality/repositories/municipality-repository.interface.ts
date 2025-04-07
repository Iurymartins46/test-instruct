import { Municipality } from '../repositories/entities/municipality.entity';

export interface MunicipalityRepositoryInterface {
  getByCodeIbge(code_ibge_municipality: string): Promise<Municipality | null>;
  getByPrefixUf(code_ibge_state: string): Promise<Municipality[]>;
}
