import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardEntity } from './entities/reward.entity';
import { ValidReward } from './entities/valid-reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardEntity, ValidReward])],
  controllers: [RewardController],
  providers: [RewardService]
})
export class RewardModule {}
