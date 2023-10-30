import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { UserModule } from 'src/user/user.module';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { BranchEntity } from './entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BranchEntity,CompanyEntity]), UserModule],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService]
})
export class BranchModule {}
