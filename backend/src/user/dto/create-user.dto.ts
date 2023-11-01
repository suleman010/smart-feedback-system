import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, isBoolean } from 'class-validator';
import { Role } from '../guards/role.enum';

export class CreateAdminDto {
  @IsString()
  // @IsOptional()
  firstName: string;

  @IsString()
  // @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  role: Role;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsBoolean()
  @IsOptional()
  isVirtual: boolean;

  @IsString()
  @IsOptional()
  manufacturer: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsString()
  @IsOptional()
  operatingSystem: string;

  @IsString()
  @IsOptional()
  osVersion: string;

  @IsString()
  @IsOptional()
  platform: string;

  @IsString()
  @IsOptional()
  webViewVersion: string;

}
