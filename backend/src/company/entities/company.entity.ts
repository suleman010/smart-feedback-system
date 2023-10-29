// company.entity.ts

import { UserEntity } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn() // Automatically sets the creation date
  created_at: Date;

  @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
  updated_at: Date;

  // This establishes a one-to-many relation with users who are Company Admins
  @OneToOne(() => UserEntity, (user: UserEntity) => user.company)
  admin: UserEntity;

}
