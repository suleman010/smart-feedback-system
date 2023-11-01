import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'valid-reward' })
export class ValidReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rewardType: string;

  @Column()
  validityDate: EpochTimeStamp;

  @Column()
  rewardPassword: string;

  @Column()
  rewardPoints: number;

  @CreateDateColumn() // Automatically sets the creation date
  created_at: EpochTimeStamp;

  @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
  updated_at: EpochTimeStamp;

  @DeleteDateColumn()
  deleted_at: EpochTimeStamp;
}
