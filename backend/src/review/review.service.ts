import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchService } from 'src/branch/branch.service';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { QuestionRatingEntity } from './entities/question-rating.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(QuestionRatingEntity)
    private readonly questionRatingRepository: Repository<QuestionRatingEntity>,
    private readonly questionService: QuestionService,
    private readonly branchService: BranchService,
  ) { }


  async create(reviewData: any): Promise<ReviewEntity> {
    const branch = await this.branchService.findOne(reviewData.branchId);

    const review = await this.reviewRepository.create({
      full_name: reviewData.fullName,
      email: reviewData.email,
      phone: reviewData.phone,
      city: reviewData.city ?? '',
      branch: branch
    });
    const savedReview = await this.reviewRepository.save(review);

    const questions = await this.questionService.findByIds(reviewData.ratings.map((rating: any) => rating.questionId));
    if (!questions || questions.length !== reviewData.ratings.length) {
      throw new NotFoundException('One or more questions were not found');
    }

    if (reviewData.ratings) {
      let ratings: any[] = [];
      for (let i = 0; i < reviewData.ratings.length; i++) {
        let ratingData = reviewData.ratings[i]
        let question = questions.find((q) => q.id == ratingData.questionId);
        if (!question) {
          throw new NotFoundException(`Question with ID ${ratingData.questionId} not found`);
        }
        const rating = await this.questionRatingRepository.create({
          review: savedReview,
          question: question,
          rating: ratingData.rating
        });

        const saveRating = await this.questionRatingRepository.save(rating);
        ratings.push(saveRating)
      }
      review.branch = branch;
      review.ratings = ratings;
      // const sum = ratings.reduce((total, currentRating) => total + currentRating.rating, 0)/ratings.length;
      review.avg_rating = ratings.reduce((total, currentRating) => total + currentRating.rating, 0)/ratings.length; 
      return this.reviewRepository.save(review);
    } else {
      throw new NotFoundException(`Ratings not found`);
    }
  }

  async findAll() {
    return await this.reviewRepository.find({ relations: ['branch', 'ratings', 'ratings.question'] });
  }

  
  async findReviewsByBranchId(branchId: number) {
    return await this.reviewRepository.find({ relations: ['branch', 'ratings', 'ratings.question'], where: { branch: { id: branchId } }});
  }
  
  async findReviewsByCompanyId(companyId: number) {
    return await this.reviewRepository.createQueryBuilder('review')
    .innerJoin('review.branch', 'branch')
    .innerJoin('branch.company', 'company')
    .where('company.id = :companyId', { companyId })
    .getMany();
  }

  async getAnalysisByCompanyId(companyId: number) {
    const reviews = await this.reviewRepository.createQueryBuilder('review')
    .innerJoin('review.branch', 'branch')
    .innerJoin('branch.company', 'company')
    .where('company.id = :companyId', { companyId })
    .getMany();

    const positiveReviewCount = reviews.filter((review) => review.avg_rating > 3).length;
    const negativeReviewCount = reviews.filter((review) => review.avg_rating < 3).length;
    const averageReviewCount = reviews.filter((review) => review.avg_rating === 3).length;
    const totalReviewCount = reviews.length;
  
    return {
      positive_review_count: positiveReviewCount,
      negative_review_count: negativeReviewCount,
      average_review_count: averageReviewCount,
      total_review_count: totalReviewCount,
    }
  }

  async getAnalysis() {
    const reviews = await this.reviewRepository.find()
    const positiveReviewCount = reviews.filter((review) => review.avg_rating > 3).length;
    const negativeReviewCount = reviews.filter((review) => review.avg_rating < 3).length;
    const averageReviewCount = reviews.filter((review) => review.avg_rating === 3).length;
    const totalReviewCount = reviews.length;
  
    return {
      positive_review_count: positiveReviewCount,
      negative_review_count: negativeReviewCount,
      average_review_count: averageReviewCount,
      total_review_count: totalReviewCount,
    };
  }
  
  async findOne(id: number) {
    return await this.reviewRepository.find({ relations: ['branch', 'ratings', 'ratings.question'], where: { id: id }});
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review12`;
  }

  async remove(id: number) {
    const review = await this.reviewRepository.findOne({ relations: ['ratings'], where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    for (const questionRating of review.ratings) {
      await this.removeQuestionRating(questionRating.id);
    }
    return await this.reviewRepository.delete(id)

  }
  
  async removeQuestionRating(id: any){
    await this.questionRatingRepository.delete(id);
  }
}
