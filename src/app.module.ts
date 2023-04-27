import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { enviroments } from './environments';
import { UsersModule } from './users/users.module';
import { ClinicsModule } from './clinic/clinics.module';

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
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: 'mysql',
          host: configService.mysql.host,
          port: configService.mysql.port,
          database: configService.mysql.name,
          username: configService.mysql.user,
          password: configService.mysql.password,
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };
      },
    }),
    UsersModule,
    ClinicsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
