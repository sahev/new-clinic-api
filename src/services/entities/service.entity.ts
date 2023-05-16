import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('services')
export class Service extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  clinicId: number;

  @Column()
  categoryId: number;

  @Column()
  price: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Category, (category) => category.services)
  category: Category;
}
