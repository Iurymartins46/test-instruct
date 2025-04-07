import { Controller, Param, Body, Get, Put, Delete, Res } from '@nestjs/common';

import { Response } from 'express';
import { GetHolidayDto } from './dtos/get-holiday.dto';
import {
  PutDeleteHolidayDto,
  HolidayNameDto,
} from './dtos/put-delete-holiday.dto';

@Controller('feriados')
export class HolidayController {
  @Get(':code_ibge/:date')
  async getHoliday(@Param() params: GetHolidayDto, @Res() res: Response) {
    try {
      console.log(params.code_ibge, params.date);
      return res.status(200).json({});
    } catch (error) {
      return res.status(error.getStatus?.()).send();
    }
  }

  @Put(':code_ibge/:data')
  async createHoliday(
    @Param() params: PutDeleteHolidayDto,
    @Body() body: HolidayNameDto,
    @Res() res: Response,
  ) {
    try {
      console.log(params.code_ibge, params.data, body.name);
      return res.status(200).send();
    } catch (error) {
      return res.status(error.getStatus?.()).send();
    }
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
