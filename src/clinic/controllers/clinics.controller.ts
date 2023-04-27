import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/models/roles.model';
import {
  CreateClinicDto,
  DefaultColumnsResponse,
  UpdateClinicDto,
} from '../dto/create-clinic.dto';
import { ClinicsService } from '../services/clinics.service';

@ApiTags('clinics') // put the name of the controller in swagger
@Controller('clinics')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @ApiOperation({ summary: 'create a clinic' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @Public() // makes the endpoint accessible to all
  @Post()
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.clinicsService.findAll();
  }

  @Public()
  @Get('alias/:alias')
  findByAlias(@Param('alias') alias: string) {
    return this.clinicsService.findByAlias(alias);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponse,
  })
  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.clinicsService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateClinicDto) {
    return this.clinicsService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(+id);
  }
}
