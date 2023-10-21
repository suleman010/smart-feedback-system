import { IsArray, IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  fullName: string;
  
  @IsEmail()
  email: string;
  
  // @IsPhoneNumber('US') // You can adjust the validation based on your requirements
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsArray()
  @ValidateNested({ each: true })
  ratings: RatingDto[];
  
  @IsInt()
  branchId: number;
}

export class RatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  questionId: number; 
}