import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyEntity } from "./entities/company.entity";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
