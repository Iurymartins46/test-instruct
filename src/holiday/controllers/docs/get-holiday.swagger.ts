import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const SwaggerGetHoliday = [
  ApiOperation({
    summary:
      'Busca o nome de um Feriado a partir do CODIGO-IBGE do estado ou municipio e da data do feriado.',
  }),

  ApiParam({
    name: 'code_ibge',
    example: '3550308',
    description:
      'Código IBGE: 2 dígitos para estados ou 7 dígitos para municípios.',
    required: true,
  }),

  ApiParam({
    name: 'date',
    example: '2025-11-20',
    description: 'Data no formato AAAA-MM-DD.',
  }),

  ApiResponse({
    status: 200,
    description: 'Feriado encontrado com sucesso.',
    schema: {
      example: { name: 'Consciência Negra' },
    },
  }),

  ApiResponse({
    status: 400,
    description:
      'Código IBGE não encontrado. Informe um código válido para o município ou estado.\n',
  }),

  ApiResponse({
    status: 404,
    description:
      'Para o estado ou município informado, não tem um feriado cadastrado para a data informada.\n',
  }),
];
