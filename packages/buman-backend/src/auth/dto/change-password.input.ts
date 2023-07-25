import { IsNotEmpty, MinLength } from 'class-validator';

export class PasswordForResetPasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
