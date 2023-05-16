import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ServicesController } from './controllers/services.controller';
import { Service } from './entities/service.entity';
import { ServicesService } from './services/services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService, JwtStrategy],
  exports: [ServicesService],
})
export class ServicesModule {}
