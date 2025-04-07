import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Municipality } from '../../../municipality/repositories/entities/municipality.entity';
import { MovableHoliday } from '../../../utils/enums/movable-holiday.enum';
import { HolidayType } from '../../../utils/enums/holiday-type.enum';


@Entity('holiday')
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  holiday_type: HolidayType;

  @Column({ nullable: true })
  date_month_day: string;

  @ManyToOne(() => Municipality, { nullable: true })
  @JoinColumn({ name: 'id_municipality' })
  municipality?: Municipality;

  @Column({ type: 'varchar', length: 2, nullable: true, default: null })
  prefix_uf: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  movable_holiday: MovableHoliday;
}
