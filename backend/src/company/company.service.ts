import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { UserService } from 'src/user/services/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly userService: UserService,
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const { name, description, adminId } = createCompanyDto;

    const newCompany = await this.companyRepository.create({
      name,
      description,
    });

    if (adminId) {
      const adminUser = await this.userService.findOne(adminId);
      adminUser ? newCompany.admin = adminUser: this.error('User not found');
    }

    return await this.companyRepository.save(newCompany);
  }

  async findAll(userId:number): Promise<CompanyEntity[]> {
    // if(user)
    const user = await this.userService.findOne(userId);
    if (user && user !== null) {
      console.log(user)
      if (user.role === 'company-admin' || user.role === 'branch-admin') {
        // Assuming that you want to retrieve companies where the user is the admin
        return await this.companyRepository
        .createQueryBuilder('company')
        .innerJoin('company.admin', 'admin')
        .leftJoinAndSelect('company.branches', 'branches')
        .where('admin.id = :userId', { userId: user.id })
        .getMany();
      } else {
        // Return all companies if the user is not a company admin or branch admin
        return await this.companyRepository.find();
      }
    } else {
      // Handle the case where the user is not found or null
      // You can throw an exception or return an appropriate response here
      throw new NotFoundException('User not found');
    }
  }


  async findOne(id: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({relations: ['questions','branches','admin'] , where: {id}});
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    company.admin.token = ""
    company.admin.passwordHash = ""
    return company;
  }

  async findAllReviews(id: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({relations: ['questions','questions.reviews'] , where: {id}});
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
    await this.companyRepository.update(id, updateCompanyDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }

  error(msg: string){
    throw new NotFoundException(msg);
  }
}
