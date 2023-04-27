import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';

@Entity('clinics')
export class Clinic extends DefaultEntity {
  @Column()
  alias: string;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  logo: Buffer;

  @Column()
  currency: string;

  @Column({ default: null })
  headQuarterId: number;
}
