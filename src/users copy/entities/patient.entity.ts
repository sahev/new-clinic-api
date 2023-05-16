import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';

@Entity('users')
export class Patient extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Column()
  clinicId: number;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  headQuarterId: number;

  @Column({ default: false })
  performService: boolean;

  @Column({ default: null })
  birthDate: Date;

  @Column({ type: 'longtext' , default: null })
  profileImage: Buffer;

  @ManyToOne(() => Clinic, (clinic) => clinic.id)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  contactId: number;

  @Column({default: null})
  description: string;

  @Column({default: null})
  speciality: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
