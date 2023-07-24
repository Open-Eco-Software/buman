import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordInput {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}
