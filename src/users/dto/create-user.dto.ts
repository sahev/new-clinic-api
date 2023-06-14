import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../auth/models/roles.model';
import { isTypedArray } from 'util/types';
import { Contact } from '../entities/contact-user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ default: '' })
  @IsString()
  readonly lastName: string;

  @IsOptional()
  readonly isFirstUser: boolean;

  @ApiProperty()
  @IsNumber()
  readonly clinicId: number;

  @ApiProperty()
  readonly active: boolean;

  @ApiProperty({ default: null })
  @IsOptional()
  readonly description: string;

  @ApiProperty({ default: null })
  @IsOptional()
  readonly speciality: string;

  @ApiProperty()
  @IsOptional()
  readonly performService: boolean;

  @ApiProperty()
  @IsOptional()
  readonly headQuarterId: number;

  @ApiProperty()
  @IsOptional()
  readonly birthDate: Date;

  @ApiProperty()
  @IsOptional()
  readonly profileImage: Buffer;

  @ApiProperty()
  @IsOptional()
  readonly color: string;
}

export class CreateAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsEnum(Role)
  readonly role: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  readonly role: Role;

  @ApiProperty()
  @IsOptional()
  readonly contact: Contact
}

export class DefaultColumnsResponse extends CreateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly role: Role;
}
