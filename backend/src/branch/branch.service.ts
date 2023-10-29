import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { UserService } from 'src/user/services/user/user.service';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';

@Injectable()
export class BranchService {

  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepository: Repository<BranchEntity>,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    // private readonly reviewService: ReviewService,
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
    if(branch.admin){
      branch.admin.token = ""
      branch.admin.passwordHash = ""

    }

    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<BranchEntity> {
    const existingBranch = await this.branchRepository.findOne({ where:{id}});

    if (!existingBranch) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Update the question properties with data from the DTO
    this.branchRepository.merge(existingBranch, updateBranchDto);

    const updatedQuestion = await this.branchRepository.save(existingBranch);

    return updatedQuestion;
  }

  async remove(id: number) {
    let branch: any = await this.branchRepository.findOne({ relations: ['admin','reviews','reviews.ratings'], where: { id } });

    if (branch) {
      if(branch.admin){
        const adminId = branch.admin.id;

        await this.userService.delete(adminId);

      }
        await this.branchRepository.softRemove({ id: branch.id });
    }
  }
}
