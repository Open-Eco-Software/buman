import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client/buman';
import { JwtDto } from '../dto/jwt.dto';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${configService.get<string>('JWT_ACCESS_SECRET')}`,
    });
  }

  async validate(payload: JwtDto): Promise<User> {
    const user = await this.userService.findOne({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
