import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const SwaggerDeleteHoliday = [
  ApiOperation({
    summary:
      'Remove um feriado fixo ou móvel de um municipio, no estado só é possivel remover um feriado fixo.',
  }),

  ApiParam({
    name: 'code_ibge',
    example: '3550308',
    description:
      'Código IBGE: 2 dígitos para estados ou 7 dígitos para municípios.',
  }),

  ApiParam({
    name: 'data',
    example: '02-20',
    description:
      'Mês e dia do feriado no formato MM-DD para feriado fixo. Para feriado móvel informe o nome do feriado (ex: "carnaval", "sexta-feira-santa", "pascoa", "corpus-christi").',
  }),

  ApiResponse({
    status: 204,
    description: 'Feriado removido com sucesso.\n',
  }),

  ApiResponse({
    status: 400,
    description: [
      'Código IBGE não encontrado. Informe um código válido para o município ou estado.\n',
      'Tentativa de deletar um feriado movel para um estado.\n',
    ].join('\n'),
  }),

  ApiResponse({
    status: 403,
    description: [
      'Tentativa de deletar um feriado nacional em um estado.\n',
      'Tentativa de deletar um feriado nacional ou estadual em um municipio.\n',
    ].join('\n'),
  }),

  ApiResponse({
    status: 404,
    description: 'Feriado não encontrado na data informada.\n',
  }),
];
