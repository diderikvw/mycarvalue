import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
// For some TS settings cannot use normal import for cookie-session
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        }
      }
    }),
    // TypeOrmModule.forRoot({
    // type: 'sqlite',
    // database: 'db.sqlite',
    // entities: [User, Report],
    // synchronize: true,
  //}), 
  UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
    })
  }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession( {
      // dfgEWEF4345$#%dsfF is a random string used to encrypt cookies
      // Do not do this on a production environment, will be changed later
      keys: ['dfgEWEF4345$#%dsfF'],
    })).forRoutes('*');
  }
}
