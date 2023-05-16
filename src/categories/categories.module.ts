import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { CategoriesController } from './controllers/categories.controller';
import { Category } from './entities/category.entity';
import { CategoriesService } from './services/categories.service';
import { Service } from 'src/services/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Service])],
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtStrategy],
  exports: [CategoriesService],
})
export class CategoriesModule {}
