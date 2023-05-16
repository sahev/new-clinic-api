import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { User } from './user.entity';

@Entity('contacts')
export class Contact extends DefaultEntity {
  @Column()
  phone: string;

  @Column()
  facebookUrl: string;

  @Column()
  instagramUrl: string;

  @Column()
  twitterUrl: string;

  @Column()
  siteUrl: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
