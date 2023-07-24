import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../services/token.service';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  logger = new Logger(LocalAuthGuard.name);
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const user = await this.tokenService.getUserFromToken(token);
      // TODO: Revoked Token
      // const isTokenRevoked = await this.tokenService.isTokenRevoked(
      //     token,
      //     user.id,
      // );
      // if (isTokenRevoked == true) {
      //     throw new UnauthorizedException('Token has been revoked');
      // }
      req.user = user;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid user');
    }
  }
}
