import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { getConfig } from './services/app-config/configuration';
import { AppCacheModule } from './app-cache/app-cache.module';
import { LoggerModule } from './logger/logger.module';
import { AsyncStorageMiddleware } from './global/middleware/async-storage/async-storage.middleware';
import { GlobalModule } from './global/global.module';
import { CompanyModule } from './company/company.module';
import { BranchModule } from './branch/branch.module';
import { ReviewModule } from './review/review.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    DbModule,
    AppCacheModule,
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
