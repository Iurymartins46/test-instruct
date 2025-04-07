import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Holiday } from '../holiday/repositories/entities/holiday.entities';
import { Municipality } from '../municipality/repositories/entities/municipality.entity';
import { HolidayType } from '../utils/enums/holiday-type.enum';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Municipality, Holiday],
  synchronize: true,
  logging: false,
});

async function seedNationalHolidays() {
  await AppDataSource.initialize();
  const holidayRepository = AppDataSource.getRepository(Holiday);

  const nationalHolidays: Partial<Holiday>[] = [
    {
      name: 'Ano Novo',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '01-01',
    },
    {
      name: 'Tiradentes',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '04-21',
    },
    {
      name: 'Dia do Trabalhador',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '05-01',
    },
    {
      name: 'Independência',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '09-07',
    },
    {
      name: 'Nossa Senhora Aparecida',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '10-12',
    },
    {
      name: 'Finados',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '11-02',
    },
    {
      name: 'Proclamação da República',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '11-15',
    },
    {
      name: 'Natal',
      holiday_type: HolidayType.NATIONAL,
      date_month_day: '12-25',
    },
  ];

  await holidayRepository.save(nationalHolidays);
  console.log(`✅ Inseridos ${nationalHolidays.length} feriados nacionais.`);

  await AppDataSource.destroy();
}

seedNationalHolidays().catch((err) => {
  console.error('❌ Erro ao rodar seed National Holidays:', err);
});
