import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ClinicsController } from './controllers/clinics.controller';
import { Clinic } from './entities/clinic.entity';
import { ClinicsService } from './services/clinics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  controllers: [ClinicsController],
  providers: [ClinicsService, JwtStrategy],
  exports: [ClinicsService],
})
export class ClinicsModule {}
