import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.input';
import { User, Role } from '@prisma/client/buman';
import { LocalAuthGuard } from '../../auth/guards/local.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { RolesGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { SafeUserDto } from '../dto/safe-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(LocalAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ description: 'Get all users | ADMIN only' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ description: 'Get users information' })
  @Get('me')
  async getInfo(@CurrentUser() user: SafeUserDto) {
    const { id, username, email } = user;
    return { id, username, email };
  }

  @ApiOperation({
    description: `Get users information through id | NORMAL users: Only if they are requesting their own information.`,
  })
  @Get(':id')
  async findOne(@Param('id') userId: string) {
    const { id, username, firstName, lastName, email, role } =
      await this.userService.findOne({
        id: userId,
      });
    return { id, username, firstName, lastName, email, role };
  }

  @ApiOperation({
    description: `Create user without going through the sign-up process | ADMIN and STAFF Only`,
  })
  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @ApiOperation({
    description: `Update users information`,
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.userService.update(id, userData);
  }

  @ApiOperation({
    description: `Delete user | Only ADMIN and STAFF unless the user is deleting itself.`,
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // @ApiOperation({
  //   description: `Verify exchangers | ADMIN and STAFF Only`,
  // })
  // @Post(':id/verify')
  // verify(@Param('id') id: string, @Body() userData: any) {
  //   return this.userService.verify(Number(id), userData);
  // }

  @ApiOperation({
    description: `Block user | ADMIN and STAFF Only`,
  })
  @Post(':id/block')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  block(@Param('id') id: string) {
    return this.userService.block(id, true);
  }

  @ApiOperation({
    description: `UnBlock user | ADMIN and STAFF Only`,
  })
  @Post(':id/unblock')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  unblock(@Param('id') id: string) {
    return this.userService.block(id, false);
  }

  @ApiOperation({
    description: `UnBlock user | ADMIN Only`,
  })
  @Put(':id/role')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: Role
  ): Promise<User> {
    return this.userService.updateUserRole(id, role);
  }
}
