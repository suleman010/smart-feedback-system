import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { BranchEntity } from './entities/branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [TypeOrmModule.forFeature([BranchEntity]), UserModule, CompanyModule],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService]
})
export class BranchModule {}
