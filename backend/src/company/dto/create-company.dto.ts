// company.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsNotEmpty()
  adminId: number;  // List of admin ID
}