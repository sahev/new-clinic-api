import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  readonly description: string;

  @ApiProperty()
  @IsNumber()
  readonly clinicId: number;

  @ApiProperty()
  readonly active: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class DefaultColumnsResponse extends CreateCategoryDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
