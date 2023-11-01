import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reward' })
export class RewardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  points: number;

  @Column({ nullable: true })
  type: string;

  @Column()
  claimedOn: EpochTimeStamp;

  @Column({
    default: false,
  })
  isRedeem: boolean;

  @ManyToOne((type) => UserEntity, (user) => user.rewards, { cascade: true })
  @JoinColumn({ name: 'user_reward_id' })
  user: UserEntity;

  @CreateDateColumn() // Automatically sets the creation date
  created_at: EpochTimeStamp;

  @UpdateDateColumn() // Automatically updates the timestamp when the record is updated
  updated_at: EpochTimeStamp;

  @DeleteDateColumn()
  deleted_at: EpochTimeStamp;
}
