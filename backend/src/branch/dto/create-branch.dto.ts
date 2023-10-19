import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateBranchDto {

    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
    
    @IsNotEmpty()
    companyId: number;  // List of admin ID
    
    @IsNotEmpty()
    adminId: number;  // List of admin ID
    
}
