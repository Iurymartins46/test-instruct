import { z } from 'zod';

export const getHolidayContract = {
  method: 'GET',
  path: '/feriados/:code_ibge/:date',
  pathParams: z.object({
    code_ibge: z
      .string()
      .regex(
        /^\d{2}$|^\d{7}$/,
        'Código Ibge invalido, deve ser 2 dígitos para estados ou 7 dígitos para municípios.',
      ),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
  }),
  responses: {
    200: z.object({
      name: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
  summary:
    'Busca o nome de um Feriado a partir do CODIGO-IBGE do estado ou municipio e da data do feriado.',
} as const;
