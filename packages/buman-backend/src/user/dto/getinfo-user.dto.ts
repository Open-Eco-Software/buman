import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  blocked: boolean;
}
