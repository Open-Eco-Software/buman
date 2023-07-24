import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client/buman';
import { Token } from '../models/token.model';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class TokenService {
  private readonly refreshSecretKey =
    this.configService.get<string>('JWT_REFRESH_SECRET');
  logger = new Logger(TokenService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) { }
  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.userService.findOne({ id });
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, { secret: this.refreshSecretKey });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const refreshIn = this.configService.get<string>('SECURITY_REFRESH_IN');
    return this.jwtService.sign(payload, {
      secret: this.refreshSecretKey,
      expiresIn: refreshIn,
    });
  }

  // TODO: Change the database implementation and session management system
  // private async isRefreshTokenRevoked(refreshToken: string): Promise<boolean> {
  //   const revokedToken = await this.prisma.revokedToken.findUnique({
  //     where: {
  //       token: refreshToken,
  //     },
  //   });
  //   return !!revokedToken;
  // }
  // async isTokenRevoked(token: string, userId: number): Promise<boolean> {
  //   const revokedToken = await this.prisma.revokedToken.findFirst({
  //     where: {
  //       token: token,
  //       userId: userId,
  //     },
  //   });
  //   return !!revokedToken;
  // }

  // TODO: Change the database refresh token in acompany with session management
  // async refreshToken(user: SafeUserDto, refreshToken: string): Promise<Token> {
  //   const isRefreshTokenValid = await this.verifyRefreshToken(refreshToken);
  //   if (!isRefreshTokenValid) {
  //     throw new InvalidTokenError('Invalid refresh token');
  //   }
  //   const isRefreshTokenRevoked = await this.isRefreshTokenRevoked(
  //     refreshToken
  //   );
  //   if (isRefreshTokenRevoked) {
  //     throw new InvalidTokenError('Invalid refresh provided');
  //   }
  //   return this.generateTokens({ userId: user.id });
  // }
  // async revokeToken(token: string) {
  //   const user = await this.getUserFromToken(token); // Implement a function to retrieve the currently logged-in user's ID
  //   const revokedToken = await this.prisma.revokedToken.create({
  //     data: { token: token, userId: user.id },
  //   });
  //   if (revokedToken) {
  //     return {
  //       message: 'Token successfully have been revoked',
  //       token: revokedToken.token,
  //     };
  //   }
  // }

  private async verifyRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const decodedRefreshToken = this.jwtService.decode(refreshToken);
      return !!decodedRefreshToken;
    } catch (error) {
      return false;
    }
  }
}
