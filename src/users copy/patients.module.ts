import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PatientsController } from './controllers/patients.controller';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './services/patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService, JwtStrategy],
  exports: [PatientsService],
})
export class PatientsModule {}
