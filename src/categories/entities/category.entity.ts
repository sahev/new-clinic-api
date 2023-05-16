import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { Service } from 'src/services/entities/service.entity';

@Entity('categories')
export class Category extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  clinicId: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
