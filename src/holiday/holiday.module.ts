import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../holiday/repositories/entities/holiday.entities';
import { HolidayRepository } from './repositories/holiday.repository';
import { HolidayController } from './controllers/holiday.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  providers: [HolidayRepository],
  controllers: [HolidayController],
})
export class HolidayModule {}
