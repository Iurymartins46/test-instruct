import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('municipality')
export class Municipality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 7, unique: true })
  code_ibge: string;

  @Column({ type: 'varchar', length: 2 })
  prefix_uf: string;
}
