import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  readonly description: string;

  @ApiProperty()
  @IsNumber()
  readonly categoryId: number;

  @ApiProperty()
  @IsNumber()
  readonly clinicId: number;

  @ApiProperty()
  @IsString()
  readonly price: string;

  @ApiProperty()
  readonly active: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class DefaultColumnsResponse extends CreateServiceDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
