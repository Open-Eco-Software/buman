import { Prisma, User } from '@prisma/client/buman';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { PasswordService } from './password.service';
import { SignUpDto } from '../dto/signup.dto';
import { UserService } from '../../user/services/user.service';
import { Token } from '../models/token.model';
import { SignInDto } from '../dto/signin.dto';
import { TokenService } from './token.service';
import { UserInfo } from '../../user/dto/getinfo-user.dto';

type SafeUserInfoResponse = UserInfo & { tokens: Token };

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService
  ) { }

  private getSafeUserInfoResponse(
    user: User,
    tokens: Token
  ): SafeUserInfoResponse {
    const { password: _, updatedAt, ...userInfo } = user;
    const response = {
      ...userInfo,
      tokens: tokens,
    };
    return response;
  }

  async signup(payload: SignUpDto): Promise<SafeUserInfoResponse> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const user = await this.userService.create({
        ...payload,
        password: hashedPassword,
      });

      const tokens = this.tokenService.generateTokens({
        userId: user.id,
      });
      return this.getSafeUserInfoResponse(user, tokens);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(error);
    }
  }

  public async signin(input: SignInDto): Promise<UserInfo & { tokens: Token }> {
    const { email, username, password } = input;
    try {
      const user = await this.validate({ email, username, password });
      const tokens = this.tokenService.generateTokens({
        userId: user.id,
      });

      return this.getSafeUserInfoResponse(user, tokens);
    } catch (error) {
      // Handle the exception here
      throw new BadRequestException(
        'User not found or provided information is invalid.'
      );
    }
  }

  public async validate(input: {
    username?: string;
    email?: string;
    password: string;
  }): Promise<User> {
    const user = await this.userService.findOne(input);
    if (user) {
      const { password: userPassword } = user;
      const passwordValidity = await this.passwordService.validatePassword(
        input.password,
        userPassword
      );
      if (passwordValidity) {
        return user;
      }
    }
    throw new NotFoundException(
      'User not found or provided information is invalid.'
    );
  }

  public signout(res: Response) {
    res.clearCookie('token');
    return res.json({ message: 'Logged out succefully' });
  }
}
