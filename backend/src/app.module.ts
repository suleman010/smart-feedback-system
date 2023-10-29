import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BranchModule } from './branch/branch.module';
import { CompanyModule } from './company/company.module';
import { DbModule } from './db/db.module';
import { GlobalModule } from './global/global.module';
import { AsyncStorageMiddleware } from './global/middleware/async-storage/async-storage.middleware';
import { LoggerModule } from './logger/logger.module';
import { QuestionModule } from './question/question.module';
import { ReviewModule } from './review/review.module';
import { getConfig } from './services/app-config/configuration';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    DbModule,
    UserModule,
    ConfigModule,
    LoggerModule,
    CompanyModule,
    BranchModule,
    ReviewModule,
    QuestionModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
