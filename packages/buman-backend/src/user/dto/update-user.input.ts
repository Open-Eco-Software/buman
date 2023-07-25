import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({ description: 'Optional' })
  username?: string;
  @ApiProperty({ description: 'Optional' })
  @IsOptional()
  displayName?: string;
}
