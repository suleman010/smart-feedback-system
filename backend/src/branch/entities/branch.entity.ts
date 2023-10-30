import { CompanyEntity } from 'src/company/entities/company.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('branches')
export class BranchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn() // Automatically sets the creation date
    created_at: Date;

    @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
    updated_at: Date; 

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date; 

    // This establishes a one-to-many relation with users who are Company Admins
    @OneToOne(() => UserEntity, (user: UserEntity) => user.branch)
    admin: UserEntity;

    // Establish a many-to-one relationship with the parent company
    @ManyToOne(() => CompanyEntity, (company) => company.branches)
    company: CompanyEntity;

    @OneToMany(() => ReviewEntity, (review) => review.branch, {
        cascade: true
    })
    reviews: ReviewEntity[];
}
