import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionEntity } from './entities/question.entity';
import { CompanyModule } from '../company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity]), CompanyModule],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule {}
