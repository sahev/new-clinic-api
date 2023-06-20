import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateClinicDto {
  @ApiProperty()
  @IsString()
  readonly alias: string;

  @ApiProperty()
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  readonly logo: Buffer;

  @ApiProperty()
  @IsOptional()
  readonly currency: string;

  @ApiProperty()
  @IsOptional()
  readonly headQuarterId: number;

  @ApiProperty()
  readonly active: boolean;

  @ApiProperty()
  @IsOptional()
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  readonly color: string;
}

export class UpdateClinicDto extends PartialType(CreateClinicDto) {}

export class DefaultColumnsResponse extends CreateClinicDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
