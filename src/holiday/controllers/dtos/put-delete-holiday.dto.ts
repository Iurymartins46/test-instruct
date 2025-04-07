import { MovableHoliday } from '../../../utils/enums/movable-holiday.enum';
import {
  IsString,
  Matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

function ValidationData(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validationData',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          const isMovable = Object.values(MovableHoliday).includes(
            value as MovableHoliday,
          );
          const regex = /^\d{2}-\d{2}$/;
          if (!regex.test(value)) return isMovable;

          const [month, day] = value.split('-').map(Number);
          const fakeDate = new Date(
            `2020-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          );
          const isRealDate =
            !isNaN(fakeDate.getTime()) &&
            fakeDate.getUTCMonth() + 1 === month &&
            fakeDate.getUTCDate() === day;

          return isMovable || isRealDate;
        },
      },
    });
  };
}

export class PutDeleteHolidayDto {
  @IsString()
  @Matches(/^\d{2}$|^\d{7}$/, {
    message: 'O código IBGE deve ter 2 ou 7 dígitos.',
  })
  code_ibge: string;

  @IsString()
  @ValidationData({
    message:
      'A data deve estar no formato MM-DD ou ser um feriado móvel válido.',
  })
  data: string;
}

export class HolidayNameDto {
  @IsString()
  name: string;
}
