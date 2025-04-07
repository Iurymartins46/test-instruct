import {
  IsString,
  Matches,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

function ValidationDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validationDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
          const [year, month, day] = value.split('-').map(Number);
          const date = new Date(value);
          return (
            !isNaN(date.getTime()) &&
            date.getUTCFullYear() === year &&
            date.getUTCMonth() + 1 === month &&
            date.getUTCDate() === day
          );
        },
      },
    });
  };
}

export class GetHolidayDto {
  @IsString()
  @Matches(/^\d{2}$|^\d{7}$/, {
    message: 'O código IBGE deve ter 2 ou 7 dígitos.',
  })
  code_ibge: string;

  @IsString()
  @ValidationDate({
    message: 'A data deve ser válida e estar no formato AAAA-MM-DD',
  })
  date: string;
}
