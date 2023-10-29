import { BranchEntity } from "src/branch/entities/branch.entity";
import { QuestionEntity } from "src/question/entities/question.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { QuestionRatingEntity } from "./question-rating.entity";

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  full_name: string;
  
  @Column()
  phone: string;
  
  @Column()
  email: string;
  
  @Column({ nullable: true})
  city: string;

  @Column({ type: 'float', nullable: true })
  avg_rating: number;

  @ManyToOne(type => BranchEntity, branch => branch.reviews)
  branch: BranchEntity;

  @OneToMany(type => QuestionRatingEntity, rating => rating.review, {
    cascade: ['soft-remove'],
})
  ratings: QuestionRatingEntity[];
}
