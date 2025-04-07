import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Municipality } from '../municipality/repositories/entities/municipality.entity';
import { Holiday } from '../holiday/repositories/entities/holiday.entities';

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

async function seedMunicipality() {
  await AppDataSource.initialize();

  const municipalityRepository = AppDataSource.getRepository(Municipality);

  const municipalitys: Municipality[] = [];

  const csvPath = path.join(__dirname, 'municipios-2019.csv');

  const readCsv = (): Promise<Municipality[]> =>
    new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          const code_ibge = row.codigo_ibge;
          const name = row.nome;
          const prefix_uf = code_ibge.slice(0, 2);

          municipalitys.push(
            municipalityRepository.create({
              code_ibge,
              name,
              prefix_uf,
            }),
          );
        })
        .on('end', () => resolve(municipalitys))
        .on('error', reject);
    });

  const municipalitysData = await readCsv();
  await municipalityRepository.save(municipalitysData);
  console.log(`✅ Inseridos ${municipalitysData.length} municipality.`);

  await AppDataSource.destroy();
}

seedMunicipality().catch((err) => {
  console.error('❌ Erro ao rodar seed Municipality:', err);
});
