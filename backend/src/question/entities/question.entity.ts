// question.entity.ts
import { CompanyEntity } from 'src/company/entities/company.entity';
import { QuestionRatingEntity } from 'src/review/entities/question-rating.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('questions')
export class QuestionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ nullable: true })
    avg_rating: number;

    @ManyToOne(() => CompanyEntity, (company) => company.questions)
    company: CompanyEntity;

    // @OneToMany(type => ReviewEntity, review => review.question)
    // reviews: ReviewEntity[];

    @OneToMany(type => QuestionRatingEntity, rating => rating.question, {
        cascade: ['soft-remove'],
    })
    ratings: QuestionRatingEntity[];

    @CreateDateColumn() // Automatically sets the creation date
    created_at: Date;
  
    @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
    updated_at: Date;
}