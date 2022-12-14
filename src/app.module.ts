import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { User } from './users/entities/user.entity';
import { ContentsModule } from './contents/contents.module';
import { Content } from './contents/entities/content.entity';
import { Category } from './contents/entities/category.entity';
import { DataSource } from 'typeorm';
import * as Joi from 'joi';
import { CollectionsModule } from './collections/collections.module';
import { Collection } from './collections/entities/collection.entity';
import { NestedContent } from './collections/entities/nested-content.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : process.env.NODE_ENV === 'prod'
          ? '.env.prod'
          : '.env.test',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_PORT: Joi.string(),
        POSTGRES_DB: Joi.string(),
        POSTGRES_USER: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.string(),
        JWT_ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_TEMPLATE_NAME_FOR_VERIFY_EMAIL: Joi.string().required(),
        MAILGUN_TEMPLATE_NAME_FOR_RESET_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB,
      port: +process.env.DB_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Content, Category, Collection, NestedContent],
    }),
    UsersModule,
    CommonModule,
    AuthModule,
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      templateNameForVerifyEmail:
        process.env.MAILGUN_TEMPLATE_NAME_FOR_VERIFY_EMAIL,
      templateNameForResetPassword:
        process.env.MAILGUN_TEMPLATE_NAME_FOR_RESET_PASSWORD,
    }),
    ContentsModule,
    CollectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
