import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user/user.service';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly userService: UserService
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    // const { name, description, adminId } = createCompanyDto;

    // const newCompany = await this.companyRepository.create({
    //   name,
    //   description,
    // });

    // if (adminId) {
    //   const adminUser = await this.userService.findOne(adminId);
    //   adminUser ? newCompany.admin = adminUser : this.error('User not found');
    // }

    // return await this.companyRepository.save(newCompany);
    throw new NotFoundException(`Company with ID not found`);
  }

  async findAll(userId: number) {

  }


  async findOne(id: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({ relations: ['questions', 'branches', 'admin'], where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    company.admin.token = ""
    company.admin.passwordHash = ""
    return company;
  }

  async findAllReviews(id: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({ relations: ['questions', 'questions.reviews'], where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
    const existingCompany = await this.companyRepository.findOne({ where:{id}});

    if (!existingCompany) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Update the question properties with data from the DTO
    this.companyRepository.merge(existingCompany, updateCompanyDto);

    const updatedCompany = await this.companyRepository.save(existingCompany);

    return updatedCompany;
  }


  async delete(id: number): Promise<void> {
    // let company: any = await this.companyRepository.findOne({ relations: ['admin', 'branches', 'branches.admin'], where: { id } });

    // if (company) {
    //   console.log(company)
    //   const adminId = company.admin.id;
    //   if(company.branches.length>0) {
    //     await this.userService.delete(adminId);
    //     company.branches.forEach(async (x:any) => {
    //       await this.userService.delete(x.id);
    //     });
    //   }
    // }
  }

  error(msg: string) {
    throw new NotFoundException(msg);
  }

  getAnalysisOfCompany(reviews:any[]) {
    const positiveReviewCount = reviews.filter((review) => review.avg_rating > 3).length;
    const negativeReviewCount = reviews.filter((review) => review.avg_rating < 3).length;
    const averageReviewCount = reviews.filter((review) => review.avg_rating === 3).length;
    const totalReviewCount = reviews.length;
    return {
      'positive_review_count': positiveReviewCount,
      'negative_review_count': negativeReviewCount,
      'average_review_count': averageReviewCount,
      'total_review_count': totalReviewCount,
    }
  }
}
