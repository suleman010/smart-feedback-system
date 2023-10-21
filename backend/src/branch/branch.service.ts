import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user/user.service';
import { Repository } from 'typeorm';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class BranchService {

  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepository: Repository<BranchEntity>,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) { }

  async create(createBranchDto: CreateBranchDto): Promise<BranchEntity> {
    const { name, description, companyId, adminId } = createBranchDto;

    if (companyId) {
      const company = await this.companyService.findOne(companyId);
      if (company) {
        const newBranch = await this.branchRepository.create({
          name,
          description
        });

        if (adminId) {
          const adminUser = await this.userService.findOne(adminId);
          adminUser ? newBranch.admin = adminUser : null;
        }

        company ? newBranch.company = company : null;
        return await this.branchRepository.save(newBranch);
      }else{
        throw new NotFoundException('Company Not Found');
      }
    }else{
      throw new NotFoundException('Company Id Not Found');
    }

  }


  async findAll() {
    return await this.branchRepository.find();
  }
  
  async findOne(id: number): Promise<BranchEntity> {
    const branch = await this.branchRepository.findOne({ relations:['company','admin'], where: {id: id}});
    if (!branch) {
      throw new NotFoundException(`branch with ID ${id} not found`);
    }

    branch.admin.token = ""
    branch.admin.passwordHash = ""

    return branch;
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
