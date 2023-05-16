import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import * as dotenv from 'dotenv'
dotenv.config()

@Entity('clinics')
export class Clinic extends DefaultEntity {
  @Column()
  alias: string;

  @Column()
  name: string;

  @Column({ type: (process.env.DB_TYPE === 'postgres' ? 'text' : 'longtext') })
  logo: Buffer;

  @Column()
  currency: string;

  @Column({ default: 0 })
  headQuarterId: number;

  @Column({ default: true })
  active: boolean;

  @Column({ default: null })
  description: string;

  clinicalUnits: Clinic[];
}
