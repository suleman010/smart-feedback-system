import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Role } from '../guards/role.enum';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { BranchEntity } from 'src/branch/entities/branch.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  email: string;

  @Column({
    name: 'password',
  })
  passwordHash: string;

  @Column({
    name: 'role',
  })
  role: Role;

  @Column({ nullable: true })
  token?: string;

  @CreateDateColumn() // Automatically sets the creation date
  created_at: Date;

  @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; 

  @OneToOne(() => CompanyEntity, company => company.admin)
  @JoinColumn({ name: 'companyId' }) // this decorator is optional but helps specify the column name
  company?: CompanyEntity;

  @OneToOne(() =>  BranchEntity, (branch) => branch.admin)
  @JoinColumn({ name: 'branchId' }) // this decorator is optional but helps specify the column name
  branch?: BranchEntity;
  // @ManyToOne(() => BranchEntity, { nullable: true })
  // @JoinColumn({ name: 'branchId' }) // this decorator is optional but helps specify the column name
  // branch?: BranchEntity;
}
