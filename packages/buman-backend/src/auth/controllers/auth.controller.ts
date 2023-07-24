import {
  Controller,
  Post,
  Response,
  Body,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../dto/signin.dto';
import { SignUpDto } from '../dto/signup.dto';
import { LocalAuthGuard } from '../guards/local.guard';
import { ResetPasswordInput } from '../dto/reset-password.input';
import { PasswordService } from '../services/password.service';
import { PasswordForResetPasswordDto } from '../dto/change-password.input';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication & Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService
  ) { }

  @ApiOperation({ summary: 'Sign up user' })
  @Post('signup')
  signUp(@Body() input: SignUpDto) {
    return this.authService.signup(input);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @Post('signin')
  signIn(@Body() input: SignInDto) {
    return this.authService.signin(input);
  }

  @ApiOperation({ summary: 'Request for password reset token' })
  @Post('password/reset')
  reqResetPassword(@Body() input: ResetPasswordInput) {
    return this.passwordService.reqResetPassword(input);
  }

  @ApiOperation({
    summary: 'Verify password request request and submit the new password',
  })
  @Post('password/:token/verify')
  verifyPassword(
    @Body() input: PasswordForResetPasswordDto,
    @Param('token') token: string
  ) {
    return this.passwordService.verifyPassword(input, token);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('token/:token/revoke')
  // async revokeSession(@Param('token') token: string) {
  //   return this.tokenService.revokeToken(token);
  // }

  // @Post('token/refresh')
  // async refreshToken(
  //   @Req() req: any,
  //   @Body() refershTokenInput: RefreshTokenInput,
  //   @CurrentUser() user: SafeUserDto
  // ) {
  //   const refreshToken = refershTokenInput.token || req.cookies.refreshToken;
  //   if (!refreshToken) {
  //     return new InvalidTokenError('No valid token provided.');
  //   }
  //   const newToken = await this.tokenService.refreshToken(user, refreshToken);
  //   return { accessToken: newToken };
  // }

  @UseGuards(LocalAuthGuard)
  @Post('signout')
  signout(@Response() res: Response) {
    return this.authService.signout(res);
  }
}
