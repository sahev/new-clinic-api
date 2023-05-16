import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { enviroments } from './environments';
import { UsersModule } from './users/users.module';
import { ClinicsModule } from './clinic/clinics.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true, //when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          synchronize: true,
          type: configService.db.type as any,
          host: configService.db.host,
          port: configService.db.port,
          database: configService.db.name,
          username: configService.db.user,
          password: configService.db.password,
          ssl: configService.db.ssl,
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };
      },
    }),
    UsersModule,
    ClinicsModule,
    AuthModule,
    CategoriesModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
