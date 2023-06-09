import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Not, Like, Repository } from 'typeorm';
import {
  CreatePatientDto,
  UpdatePatientDto,
} from '../dto/create-patient.dto';
import { Patient } from '../entities/patient.entity';
import { Role } from 'src/auth/models/roles.model';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>
  ) {}

  async create(createUserDto: CreatePatientDto) {
    const user = await this.patientRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const createdUser = this.patientRepository.create(createUserDto);

    if (createUserDto.isFirstUser) {
      createdUser.role = Role.ADMIN;
    }

    const saveUser = await this.patientRepository.save(createdUser);

    delete saveUser.password;
    delete saveUser.refreshToken;
    return saveUser;
  }

  async findAllByClinicId(id: number) {
    return this.patientRepository.find({
      where: [
        { clinicId: id, role: Not(Role.SUPER)  }
      ],
      relations: ['contact']
    });
  }

  async findAllByHeadQuarterId(id: number) {
    return this.patientRepository.find({
      where: [
        { clinicId: id, role: Not(Role.SUPER)  },
        { headQuarterId: id, role: Not(Role.SUPER)  }
      ],
      relations: ['contact']
    });
  }

  async findByEmailAndGetPassword(email: string) {
    return await this.patientRepository.findOne({
      select: ['id', 'password', 'role', 'clinicId'],
      where: { email },
    });
  }

  async findOneBy(id: number) {
    return await this.patientRepository.findOne({
      where: { id },
      relations: ['contact']
    });
  }

  async findAllByName(clinicId: number, name: string) {

    return this.patientRepository.find({
      where: [
        { clinicId, firstName: Like(`%${name}%`) },
        { clinicId, email: Like(`%${name}%`) }
      ],
      select: ['id', 'firstName', 'lastName', 'email']
    });
  }

  async findById(userId: number) {
    return await this.patientRepository.findOneByOrFail({id: userId});
  }

  async findByEmail(email: string) {
    return await this.patientRepository.find({
      where: { email },
    });
  }

  async emailExists(email: string) {
    const user = await this.patientRepository.find({
      where: { email },
    });

    if (user.length > 0) return true;

    return false;
  }

  async update(id: number, updateUserDto: UpdatePatientDto) {
    const user = await this.patientRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    await this.patientRepository.save(user);

    return user
  }

  async remove(id: number) {
    const user = await this.patientRepository.findOneBy({id});

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.patientRepository.remove(user);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    //crypto is a node module, and bcrypt the maximum length of the hash is 60 characters, and token is longer than that, so we need to hash it
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    return await this.patientRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    await this.findById(userId);

    return this.patientRepository.update(
      { id: userId },
      {
        refreshToken: null,
      },
    );
  }

  async getUserIfRefreshTokenMatches(refreshTokenn: string, userId: number) {
    const {id, refreshToken, role} = await this.patientRepository.findOneBy({ id: userId });

    const user = {
      id,
      refreshToken,
      role
    }

    const hash = createHash('sha256').update(refreshTokenn).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id, role: user.role };
    }
  }
}
