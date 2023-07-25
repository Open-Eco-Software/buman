import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CustomPrismaModule as BumanPrismaModule,
  // loggingMiddleware,
} from 'nestjs-prisma';
import { PrismaClient } from '@prisma/client/buman';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
// import { Logger } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BumanPrismaModule.forRoot({
      isGlobal: true,
      // prismaServiceOptions: {
      //   middlewares: [
      //     loggingMiddleware({
      //       logger: new Logger('BumanPrismaModule'),
      //       logLevel: 'log',
      //     }),
      //   ],
      // },
      name: 'BumanPrismaClient',
      client: new PrismaClient(),
    }),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.register({ isGlobal: true }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
