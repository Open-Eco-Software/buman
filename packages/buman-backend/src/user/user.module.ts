import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../auth/services/password.service';
import { CustomPrismaService as BumanPrismaService } from 'nestjs-prisma';
import { PrismaClient as BumanPrismaClient } from '@prisma/client/buman';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [AuthModule],
  providers: [
    UserService,
    ConfigService,
    JwtService,
    PasswordService,
    // BumanPrismaService<BumanPrismaClient>
  ],
  exports: [UserService],
})
export class UserModule { }
