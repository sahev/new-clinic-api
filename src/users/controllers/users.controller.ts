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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  CreateAdminDto,
  CreateUserDto,
  DefaultColumnsResponse,
  UpdateUserDto,
} from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users') // put the name of the controller in swagger
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create a user with customer role' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @Public() // makes the endpoint accessible to all
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'create a user with admin role' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token') // in the swagger documentation, a bearer token is required to access this endpoint
  // @Roles(Role.SUPER, Role.ADMIN) // m akes the endpoint accessible only by the admin
  @Post('admin')
  createAdmin(@Body() creatAdminDto: CreateAdminDto) {
    return this.usersService.create(creatAdminDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get()
  findAllByClinicId(@Headers('clinicId') clinicId: number) {
    return this.usersService.findAllByClinicId(clinicId);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get('name/:name')
  findAllByName(@Headers('clinicId') clinicId: number, @Param('name') name: string) {
    return this.usersService.findAllByName(clinicId, name);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get('headquarter/:id')
  findAllByHeadQuarterId(@Param('id') id: number) {
    return this.usersService.findAllByHeadQuarterId(id);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponse,
  })
  @Get(':id')
  findOneBy(@Param('id') id: string) {
    return this.usersService.findOneBy(+id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Public()
  @Get('email/:email')
  emailExists(@Param('email') id: string) {
    return this.usersService.emailExists(id);
  }

  @ApiBearerAuth('access-token')
  @Patch('toggleStatus/:id')
  toggleStatus(@Param('id') id: number) {
    return this.usersService.toggleStatus(id);
  }

  @ApiBearerAuth('access-token')
  @Patch('togglePerformServiceStatus/:id')
  togglePerformServiceStatus(@Param('id') id: number) {
    return this.usersService.togglePerformServiceStatus(id);
  }
}
