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

    
  // async create(reviewData: ReviewDto) {
  //   const { branchId, reviewQuestions, ...reviewDetails } = reviewData;

  //   // Validate that the branch exists
  //   const branch = await this.branchService.findOne(branchId);
  //   if (!branch) {
  //     throw new NotFoundException(`Branch with ID ${branchId} not found`);
  //   }

  //   // Create a new review
  //   const review = this.reviewRepository.create({
  //     ...reviewDetails,
  //     branch,
  //     reviewDate: new Date(),
  //   });

  //   // Create review questions and associate them with the review
  //   const questions = reviewQuestions.map((questionData: ReviewQuestionDto) =>
  //     this.reviewQuestionRepository.create({
  //       ...questionData,
  //       review,
  //     })
  //   );

  //   // Save the review and its associated questions
  //   review.reviewQuestions = questions;
  //   const savedReview = await this.reviewRepository.save(review);

  //   return savedReview;
  // }


  // async create(createReviewDTO: CreateReviewDto): Promise<ReviewEntity> {
  //   const { customerName, customerEmail, branchId, questionRatings } = createReviewDTO;

  //   const entityManager = getManager(); // Retrieve the EntityManager

  //   try {
  //     const review = new ReviewEntity();
  //     // Start a transaction
  //     await entityManager.transaction(async transactionalEntityManager => {
  //       const branch = await this.branchService.findOne(branchId);

  //       if (!branch) {
  //         throw new NotFoundException(`Branch with ID ${branchId} not found`);
  //       }

  //       review.customerName = customerName;
  //       review.customerEmail = customerEmail;
  //       review.branch = branch;

  //       for (const questionRating of questionRatings) {
  //         const question = await this.questionService.findOne(questionRating.questionId);

  //         if (!question || question == null) {
  //           throw new NotFoundException(`Question with ID ${questionRating.questionId} not found`);
  //         }

  //         if (questionRating.rating < 1 || questionRating.rating > 5) {
  //           throw new BadRequestException(`Invalid rating value for question ${question.id}`);
  //         }

  //         review.questionRatings.push({question:question, rating: questionRating.rating});
  //         // review.questions.push(question);
  //         // review.ratings.push({
  //         //   question,
  //         //   rating: questionRating.rating,
  //         // });
  //       }

  //       await this.reviewRepository.save(review); // Save the review and related entities
  //     });
  //     return review;

  //     // If everything is successful, return the created review
  //   } catch (error) {
  //     // Handle errors
  //     if (error instanceof NotFoundException || error instanceof BadRequestException) {
  //       throw error; // Rethrow NotFoundException and BadRequestException
  //     } else {
  //       throw new BadRequestException('Failed to create the review.');
  //     }
  //   }
  // }

  findAll() {
    return `This action returns all review`;
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
