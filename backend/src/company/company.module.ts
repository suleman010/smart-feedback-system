import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyEntity } from "./entities/company.entity";
import { QuestionEntity } from "src/question/entities/question.entity";
import { QuestionRatingEntity } from "src/review/entities/question-rating.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, QuestionEntity, QuestionRatingEntity]), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {} 
