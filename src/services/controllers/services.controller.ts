import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Headers
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
  CreateServiceDto,
  DefaultColumnsResponse,
  UpdateServiceDto,
} from '../dto/create-service.dto';
import { ServicesService } from '../services/services.service';

@ApiTags('Services') // put the name of the controller in swagger
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @ApiOperation({ summary: 'create a service' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @Public() // makes the endpoint accessible to all
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Public()
  @Get()
  findAll(@Headers('clinicId') id: number) {
    return this.serviceService.findAll(id);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponse,
  })
  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.serviceService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }

  @ApiBearerAuth('access-token')
  @Patch('toggleStatus/:id')
  toggleStatus(@Param('id') id: number) {
    return this.serviceService.toggleStatus(id);
  }
}
