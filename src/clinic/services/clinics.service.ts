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
  constructor (
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) { }

  async create (createClinicDto: CreateClinicDto) {
    const clinic = await this.clinicRepository.findOneBy({
      alias: createClinicDto.alias,
      headQuarterId: createClinicDto.headQuarterId
    });

    if (clinic) {
      throw new BadRequestException('This alias already exists');
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

  async findAll (id: number) {
    return this.clinicRepository.find({
      where: { headQuarterId: id }
    });
  }

  async findOne (id: number) {
    let clinicalUnits = await this.clinicRepository.find({
      where: { headQuarterId: id }
    })
    let clinic = await this.clinicRepository.findOneBy({ id });

    clinic.clinicalUnits = clinicalUnits

    return clinic
  }

  async findById (clinicId: number) {
    return await this.clinicRepository.findOneByOrFail({ id: clinicId });
  }

  async findByAlias (alias: string) {
    return await this.clinicRepository.find({
      where: { alias },
    });
  }

  async update (id: number, updateClinicDto: UpdateClinicDto) {
    const clinic = await this.clinicRepository.preload({
      id,
      ...updateClinicDto,
    });

    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${id} does not exist`);
    }
    return this.clinicRepository.save(clinic);
  }

  async remove (id: number) {
    const clinic = await this.clinicRepository.findOneBy({ id });

    if (!clinic) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.clinicRepository.remove(clinic);
  }

  async toggleStatus (id: number) {
    let clinic = await this.clinicRepository.findOneBy({ id })
    clinic.active = !clinic.active
    this.clinicRepository.save(clinic)
  }
}
