import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { QuestionEntity } from 'src/question/entities/question.entity';

@Entity('question_ratings')
export class QuestionRatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ReviewEntity, (review) => review.ratings) // Assuming a One-to-Many relationship
  review: ReviewEntity;

  @ManyToOne(() => QuestionEntity)
  question: QuestionEntity;

  @Column({ type: 'integer' })
  rating: number;
}
