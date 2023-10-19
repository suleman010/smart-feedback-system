// import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
// import { ReviewEntity } from "./review.entity";
// import { QuestionEntity } from "src/question/entities/question.entity";

// @Entity('review_question')
// export class ReviewQuestionJoin {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;

//   @ManyToOne(() => ReviewEntity, (review) => review.reviewQuestionJoins)
//   @JoinColumn()
//   review: ReviewEntity;

//   @ManyToOne(() => QuestionEntity, (question) => question.reviewQuestionJoins)
//   @JoinColumn()
//   question: QuestionEntity;
// }
