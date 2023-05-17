import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
      clinicId: createCategoryDto.clinicId
    });

    if (category) {
      throw new BadRequestException('This category already exists');
    }

    const createdCategory = this.categoryRepository.create(createCategoryDto);
    const saveCategory = await this.categoryRepository.save(createdCategory);
    return saveCategory;
  }

  async findAll(id: number) {
    return this.categoryRepository.find(
      { where: { clinicId: id }}
    );
  }

  async findOneBy(id: number) {
    return await this.categoryRepository.findOneBy({id});
  }

  async findById(categoryId: number) {
    return await this.categoryRepository.findOneByOrFail({id: categoryId});
  }

  async findByAlias(alias: string) {
    return await this.categoryRepository.find({ where: { name: alias } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exist`);
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({id});

    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exist`);
    }

    return this.categoryRepository.remove(category);
  }

  async toggleStatus(id: number) {
    let category = await this.categoryRepository.findOneBy({ id })
    category.active = !category.active
    this.categoryRepository.save(category)
  }
}
