import { IsIn, IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  branchId: number;

  @IsInt()
  questionId: number;
  
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

}
