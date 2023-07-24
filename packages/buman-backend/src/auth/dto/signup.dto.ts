import { IsEmail, Matches, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @ApiPropertyOptional()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Minmum password length is 8',
  })
  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_.-]{3,17}$/, {
    message:
      "Only username that contain lowercase letters, numbers, '_', '-' and '.' with min 3 max 17 length",
  })
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
