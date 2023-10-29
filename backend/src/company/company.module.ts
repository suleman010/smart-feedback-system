import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchService } from "src/branch/branch.service";
import { UserModule } from "src/user/user.module";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyEntity } from "./entities/company.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {} 
