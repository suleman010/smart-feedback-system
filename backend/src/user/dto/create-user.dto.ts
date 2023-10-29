import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
