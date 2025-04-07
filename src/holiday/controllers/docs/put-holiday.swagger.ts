import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

export const SwaggerPutHoliday = [
  ApiOperation({
    summary:
      'Cria um feriado fixo ou móvel para um municipio, no estado só é possivel criar feriado fixo.\nSe já existir um feriado cadastrado neste dia para o estado ou município especificado, o nome do feriado é atualizado com o nome informado na requisição.',
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

  ApiBody({
    description: 'Nome do feriado (opcional)',
    required: false,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      examples: {
        estadual: {
          summary: 'Feriado estadual',
          value: { name: 'Consciência Negra' },
        },
        municipal: {
          summary: 'Feriado municipal',
          value: { name: 'Aniversário da cidade de São Paulo' },
        },
        movel: {
          summary: 'Feriado móvel',
          value: {},
        },
      },
    },
  }),

  ApiResponse({
    status: 201,
    description: 'Requisição realizada com sucesso.\n',
  }),

  ApiResponse({
    status: 400,
    description: [
      'Código IBGE não encontrado. Informe um código válido para o município ou estado.\n',
      'Tentativa de cadastrar um feriado fixo, mas não informa o nome do feriado.\n',
      'Tentativa de cadastrar um feriado movel para um estado.\n',
    ].join('\n'),
  }),

  ApiResponse({
    status: 403,
    description: [
      'Existe um feriado nacional cadastrado para a data informada, não é possível cadastrar um novo feriado nem atualizar o nome do mesmo.\n',
      'Já existe um feriado estadual na data informada, não é possível cadastrar um feriado municipal.\n',
    ].join('\n'),
  }),
];
