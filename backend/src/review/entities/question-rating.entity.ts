import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; 

  @CreateDateColumn() // Automatically sets the creation date
  created_at: Date;

  @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
  updated_at: Date;
}
