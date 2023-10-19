// question.entity.ts
import { CompanyEntity } from 'src/company/entities/company.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

    @OneToMany(type => ReviewEntity, review => review.question)
    reviews: ReviewEntity[];
}