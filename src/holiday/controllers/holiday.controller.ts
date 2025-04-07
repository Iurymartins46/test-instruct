import { Controller, Param, Body, Get, Put, Delete, Res } from '@nestjs/common';

import { Response } from 'express';
import { GetHolidayDto } from './dtos/get-holiday.dto';
import { HolidayService } from '../service/holiday.service';
import {
  PutDeleteHolidayDto,
  HolidayNameDto,
} from './dtos/put-delete-holiday.dto';

@Controller('feriados')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get(':code_ibge/:date')
  async getHoliday(@Param() params: GetHolidayDto) {
    const holiday = await this.holidayService.getHoliday(
      params.code_ibge,
      params.date,
    );

    return {
      name: holiday.name,
    };
  }

  @Put(':code_ibge/:data')
  async createHoliday(
    @Param() params: PutDeleteHolidayDto,
    @Body() body: HolidayNameDto,
  ) {
    return await this.holidayService.createHoliday(
      body.name,
      params.code_ibge,
      params.data,
    );
  }

  @Delete(':code_ibge/:data')
  async deleteHoliday(
    @Param() params: PutDeleteHolidayDto,
    @Res() res: Response,
  ) {
    try {
      return res.status(204).send();
    } catch (error) {
      return res.status(error.getStatus?.()).send();
    }
  }
}
