import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordInput {
    @IsEmail()
    @ApiProperty()
    email: string;
}
