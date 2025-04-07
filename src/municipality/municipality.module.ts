import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipality } from './repositories/entities/municipality.entity';
import { MunicipalityService } from './service/municipality.service';
import { MunicipalityRepository } from './repositories/municipality.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Municipality])],
  providers: [
    MunicipalityService,
    {
      provide: 'MunicipalityRepositoryInterface',
      useClass: MunicipalityRepository,
    },
  ],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
