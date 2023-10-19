import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchModule } from 'src/branch/branch.module';
import { QuestionModule } from 'src/question/question.module';
import { ReviewEntity } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), QuestionModule, BranchModule],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
