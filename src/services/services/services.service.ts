import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { CreateServiceDto, UpdateServiceDto } from '../dto/create-service.dto';
import { Service } from '../entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const service = await this.serviceRepository.findOneBy({
      name: createServiceDto.name,
      clinicId: createServiceDto.clinicId
    });

    if (service) {
      throw new BadRequestException('This service already exists');
    }

    const createdService = this.serviceRepository.create(createServiceDto);

    let saved = await this.serviceRepository.save(createdService);

    let res = await getRepository(Service).findOne({
      where: { clinicId: saved.clinicId, id: saved.id },
      relations: ['category']
   })


    return res;
  }

  async findAll(id: number) {
    return await getRepository(Service).find({
      where: { clinicId: id },
      relations: ['category']
   })
  }

  async findOneBy(id: number) {
    return await this.serviceRepository.findOneBy({id});
  }

  async findById(serviceId: number) {
    return await this.serviceRepository.findOneOrFail({ where: { id: serviceId } });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.preload({
      id,
      ...updateServiceDto,
    });

    if (!service) {
      throw new NotFoundException(`Service with id ${id} does not exist`);
    }
    return this.serviceRepository.save(service);
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findOneBy({id});

    if (!service) {
      throw new NotFoundException(`Service with id ${id} does not exist`);
    }

    return this.serviceRepository.remove(service);
  }

  async toggleStatus(id: number) {
    let service = await this.serviceRepository.findOneBy({id: id })
    service.active = !service.active
    this.serviceRepository.save(service)
  }
}
