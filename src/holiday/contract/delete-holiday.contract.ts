import { z } from 'zod';
import { MovableHoliday } from '../../utils/enums/movable-holiday.enum';

const validMovable = Object.values(MovableHoliday);

export const deleteHolidayContract = {
  method: 'DELETE',
  path: '/feriados/:code_ibge/:data',
  pathParams: z.object({
    code_ibge: z
      .string()
      .regex(
        /^\d{2}$|^\d{7}$/,
        'Código Ibge invalido, deve ser 2 dígitos para estados ou 7 dígitos para municípios.',
      ),
    data: z.string().refine(
      (value) => {
        const isMovable = validMovable.includes(value as MovableHoliday);
        const regex = /^\d{2}-\d{2}$/;
        if (!regex.test(value)) return isMovable;
        const [month, day] = value.split('-').map(Number);
        const fakeDate = new Date(`2020-${month}-${day}`);
        return (
          !isNaN(fakeDate.getTime()) &&
          fakeDate.getUTCDate() === day &&
          fakeDate.getUTCMonth() + 1 === month
        );
      },
      { message: 'Formato inválido. Use MM-DD ou passe o feriado móvel.' },
    ),
  }),
  responses: {
    204: z.object({
      message: z.string(),
    }),
    400: z.object({
      message: z.string(),
    }),
    403: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
  summary:
    'Remove um feriado fixo ou móvel de um municipio, no estado só é possivel remover um feriado fixo.',
} as const;
