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
  CreateCategoryDto,
  DefaultColumnsResponse,
  UpdateCategoryDto,
} from '../dto/create-category.dto';
import { CategoriesService } from '../services/categories.service';

@ApiTags('Categories') // put the name of the controller in swagger
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'create a category' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @Public() // makes the endpoint accessible to all
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  findAll(@Headers('clinicId') id: number) {
    return this.categoriesService.findAll(id);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponse,
  })
  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id).then(() => true).catch(() => false);
  }

  @ApiBearerAuth('access-token')
  @Patch('toggleStatus/:id')
  toggleStatus(@Param('id') id: number) {
    return this.categoriesService.toggleStatus(id);
  }
}
