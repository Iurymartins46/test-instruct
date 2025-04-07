import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './repositories/entities/holiday.entity';
import { HolidayRepository } from './repositories/holiday.repository';
import { HolidayController } from './controllers/holiday.controller';
import { HolidayService } from './service/holiday.service';
import { MunicipalityModule } from '../municipality/municipality.module';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday]), MunicipalityModule],
  providers: [
    HolidayService,
    {
      provide: 'HolidayRepositoryInterface',
      useClass: HolidayRepository,
    },
  ],
  controllers: [HolidayController],
})
export class HolidayModule {}
