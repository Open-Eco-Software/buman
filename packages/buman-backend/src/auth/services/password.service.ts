import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordInput } from '../dto/reset-password.input';
import { PasswordForResetPasswordDto } from '../dto/change-password.input';
import { randomBytes } from 'crypto';
import { hash, compare } from 'bcrypt';
import config from '../../configs/config';
import { InvalidTokenError } from '@./common-nest';
import { CustomPrismaService as BumanPrismaService } from 'nestjs-prisma';
import { PrismaClient as BumanPrismaClient } from '@prisma/client/buman';
import { convertTimeStringToMilliseconds } from '@./common-utils';

@Injectable()
export class PasswordService {
  private logger = new Logger(PasswordService.name);
  private durationConfig =
    this.configService.get<string>('RESET_PASSWORD_TOKEN_EXPIRAATION') ||
    config.security.passwordResetTokenExpiresIn;
  private expireDuration = 0;

  private saltOrRounds =
    this.configService.get<number>('SECURITY_BCRYPT_SALT_OR_ROUND') ||
    config.security.bcryptSaltOrRound;

  constructor(
    private configService: ConfigService,
    @Inject('BumanPrismaClient')
    private prisma: BumanPrismaService<BumanPrismaClient>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.expireDuration = convertTimeStringToMilliseconds(this.durationConfig);
  }

  get bcryptSaltRounds(): string | number {
    return Number.isInteger(Number(this.saltOrRounds))
      ? Number(this.saltOrRounds)
      : this.saltOrRounds;
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.bcryptSaltRounds);
  }

  private generateResetPasswordToken = () => {
    return randomBytes(32).toString('hex');
  };

  async changeForgotPassword(
    newPasswordReq: PasswordForResetPasswordDto,
    userId: string
  ) {
    const hashedPassword = await this.hashPassword(newPasswordReq.newPassword);
    return this.prisma.client.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  // TODO: Use mail service to create
  // NOTE: In order to implement mailing you need to have the correct routing URL for the webapp ui(next.js)
  // to provide link through email.
  async reqResetPassword(input: ResetPasswordInput) {
    const token = this.generateResetPasswordToken();
    const user = await this.prisma.client.user.findUnique({
      where: { email: input.email },
    });

    if (user) {
      await this.cacheManager.set(token, user.id, this.expireDuration);
      return {
        expiresIn: this.expireDuration,
        message: `Please checkout your verification link token on your ${input.email} email `,
      };
    }
  }

  async verifyPassword(input: PasswordForResetPasswordDto, token: string) {
    const userId: string = await this.cacheManager.get(token);
    if (!userId) {
      throw new InvalidTokenError('Invalid or expired token provided.');
    }
    this.changeForgotPassword(input, userId);
    this.cacheManager.del(token);
    return {
      message: 'Your password have been reseted successfully',
    };
    // reset the password for that email
  }
}
