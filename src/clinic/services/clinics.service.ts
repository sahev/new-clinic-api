import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClinicDto, UpdateClinicDto } from '../dto/create-clinic.dto';
import { Clinic } from '../entities/clinic.entity';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {}

  async create(createClinicDto: CreateClinicDto) {
    const clinic = await this.clinicRepository.findOne({
      alias: createClinicDto.alias,
    });

    if (clinic) {
      throw new BadRequestException();
    }

    const createdClinic = this.clinicRepository.create(createClinicDto);

    if (!createdClinic.name) {
      createdClinic.name = '';
      createdClinic.currency = '';
      createdClinic.logo = Buffer.from('');
    }

    const saveClinic = await this.clinicRepository.save(createdClinic);
    return saveClinic;
  }

  async findAll() {
    return this.clinicRepository.find();
  }

  async findOne(id: number) {
    return await this.clinicRepository.findOne(id);
  }

  async findById(clinicId: number) {
    return await this.clinicRepository.findOneOrFail(clinicId);
  }

  async findByAlias(alias: string) {
    return await this.clinicRepository.find({
      where: { alias },
    });
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    // let e = Buffer.from("\\x" + Buffer.from(updateClinicDto.logo.toString(), "base64").toString("hex"))

    const user = await this.clinicRepository.preload({
      id,
      ...updateClinicDto,
    });

    if (!user) {
      throw new NotFoundException(`Clinic with id ${id} does not exist`);
    }
    return this.clinicRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.clinicRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.clinicRepository.remove(user);
  }
}
