import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { CustomPrismaService as BumanPrismaService } from 'nestjs-prisma';
import { PrismaClient as BumanPrismaClient } from '@prisma/client/buman';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PasswordService,
    JwtService,
    TokenService,
  ],
})
export class AuthModule { }
