// company.entity.ts

import { BranchEntity } from 'src/branch/entities/branch.entity';
import { QuestionEntity } from 'src/question/entities/question.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; 

  @CreateDateColumn() // Automatically sets the creation date
  created_at: Date;

  @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
  updated_at: Date;

  // This establishes a one-to-many relation with users who are Company Admins
  @OneToOne(() => UserEntity, (user: UserEntity) => user.company)
  admin: UserEntity;

  // One-to-many relationship with branches
  @OneToMany(() => BranchEntity, (branch) => branch.company, {
    cascade: true, // Enable cascading soft remove (soft-delete) for related ReviewEntity records
  })
  branches: BranchEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.company, {
    cascade: true,
  })
  questions: QuestionEntity[];
  // ke 334215
}
