import { BranchEntity } from "src/branch/entities/branch.entity";
import { QuestionEntity } from "src/question/entities/question.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // feedback: string;

  @Column({ type: 'integer' })
  rating: number; // Add a field to store the rating (1 to 5 stars)

  @ManyToOne(type => BranchEntity, branch => branch.reviews)
  branch: BranchEntity;

  @ManyToOne(type => QuestionEntity, question => question.reviews)
  question: QuestionEntity;
}
