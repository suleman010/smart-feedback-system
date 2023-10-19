import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchService } from 'src/branch/branch.service';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly questionService: QuestionService,
    private readonly branchService: BranchService,
  ) {}
  
  async create(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { rating, branchId, questionId } = createReviewDto;

    const branch = await this.branchService.findOne(branchId)
    const question = await this.questionService.findOne(questionId)

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} not found`);
    }

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    const review = new ReviewEntity();
    review.rating = rating
    review.branch = branch;
    review.question = question;

    // return await this.reviewRepository.save(review);
    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find({ relations: ['question', 'branch'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
