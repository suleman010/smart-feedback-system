import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user/user.service';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { BranchService } from 'src/branch/branch.service';
import { BranchEntity } from 'src/branch/entities/branch.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly userService: UserService,
    // @InjectRepository(BranchEntity)
    // private readonly branchRepository: Repository<BranchEntity>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const { name, description, adminId } = createCompanyDto;

    const newCompany = await this.companyRepository.create({
      name,
      description,
    });

    if (adminId) {
      const adminUser = await this.userService.findOne(adminId);
      adminUser ? newCompany.admin = adminUser : this.error('User not found');
    }

    return await this.companyRepository.save(newCompany);
  }

  async findAll(userId: number) {
    // if(user)
    const user = await this.userService.findOne(userId);
    if (user && user !== null) {
      if (user.role === 'company-admin' || user.role === 'branch-admin') {
        // Assuming that you want to retrieve companies where the user is the admin
        let company: any = await this.companyRepository
          .createQueryBuilder('company')
          .innerJoin('company.admin', 'admin')
          .leftJoinAndSelect('company.branches', 'branches')
          .leftJoinAndSelect('branches.reviews', 'reviews')
          .where('admin.id = :userId', { userId: user.id })
          .getMany();
          // .where('company.deletedAt IS NULL')

        if ( company && company.length > 0 && company[0].branches) {
          let reviews = company[0].branches.flatMap((branch:any) => branch.reviews);
          company[0]['analysis'] = this.getAnalysisOfCompany(reviews)

          company[0].branches.forEach((branch: any, index: any) => {
            const positiveReviewCount = branch.reviews.filter((review: any) => review.avg_rating > 3).length;
            const negativeReviewCount = branch.reviews.filter((review: any) => review.avg_rating < 3).length;
            const averageReviewCount = branch.reviews.filter((review: any) => review.avg_rating === 3).length;
            const totalReviewCount = branch.reviews.length;
            company[0].branches[index]['analysis'] = {
              positive_review_count: positiveReviewCount,
              negative_review_count: negativeReviewCount,
              average_review_count: averageReviewCount,
              total_review_count: totalReviewCount,
            };
          });

        }

        return company;
      } else {
        console.log('aaaaa')
        // Return all companies if the user is not a company admin or branch admin
        let company1: any = await this.companyRepository
          .createQueryBuilder('company')
          // .innerJoin('company.admin', 'admin')
          // .leftJoinAndSelect('company.branches', 'branches')
          // .leftJoinAndSelect('branches.reviews', 'reviews')
          .getMany();

          const company = await this.companyRepository.find({ relations: ['admin', 'branches', 'branches.reviews']})
          // .where('company.deletedAt IS NULL')

          console.log(company)
        company.forEach((c: any) => {
          let reviews = c.branches.flatMap((branch:any) => branch.reviews);
          c['analysis'] = this.getAnalysisOfCompany(reviews)

          if (c.branches) {
            c.branches.forEach((branch: any, index: any) => {
              const positiveReviewCount = branch.reviews.filter((review: any) => review.avg_rating > 3).length;
              const negativeReviewCount = branch.reviews.filter((review: any) => review.avg_rating < 3).length;
              const averageReviewCount = branch.reviews.filter((review: any) => review.avg_rating === 3).length;
              const totalReviewCount = branch.reviews.length;
              c.branches[index]['analysis'] = {
                positive_review_count: positiveReviewCount,
                negative_review_count: negativeReviewCount,
                average_review_count: averageReviewCount,
                total_review_count: totalReviewCount,
              };

            });
          }

        });

        return company;
      }
    } else {
      // Handle the case where the user is not found or null
      // You can throw an exception or return an appropriate response here
      throw new NotFoundException('User not found');
    }
  }


  async findOne(id: number): Promise<CompanyEntity> {
    let company = await this.companyRepository.findOne({ relations: ['questions', 'branches', 'admin'], where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    if(company.admin){
      company.admin.token = ""
      company.admin.passwordHash = ""
    }
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
    let company: any = await this.companyRepository.findOne({ relations: ['admin', 'branches', 'branches.admin'], where: { id } });

    if (company) {
      if(company.admin){
        const adminId = company.admin.id;

        await this.userService.delete(adminId);

      }
      await this.companyRepository.softRemove({ id: company.id });
      
    }
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
